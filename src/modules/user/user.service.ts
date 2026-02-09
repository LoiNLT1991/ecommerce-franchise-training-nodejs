import { HttpStatus } from "../../core/enums";
import { HttpException } from "../../core/exceptions";
import { MailService, MailTemplate } from "../../core/services";
import { checkEmptyObject, encodePassword, withTransaction } from "../../core/utils";
import { createTokenVerifiedUser } from "../../core/utils/helpers";
import ChangeStatusDto from "./dto/changeStatus.dto";
import CreateUserDto from "./dto/create.dto";
import { IUser, IUserQuery, IUserValidation } from "./user.interface";
import { UserRepository } from "./user.repository";

export default class UserService {
  constructor(
    private readonly repo: UserRepository,
    private readonly userValidation: IUserValidation,
    private readonly userQuery: IUserQuery,
    private readonly mailService: MailService,
  ) {}

  public async createUser(model: CreateUserDto, originDomain?: string | undefined): Promise<IUser> {
    await checkEmptyObject(model);

    const result = await withTransaction(async (session) => {
      // 1. Validate email
      await this.userValidation.validEmailUnique(model.email);

      // 2. Prepare data
      const password = await encodePassword(model.password);
      const token = createTokenVerifiedUser();

      // 3. Create user
      const user = await this.userQuery.createUser(
        {
          ...model,
          password,
          verification_token: token.verification_token,
          verification_token_expires: token.verification_token_expires,
        },
        session,
      );

      delete user.password;
      return { user, token };
    });

    const { user, token } = result;

    // 4. Send mail (side-effect)
    try {
      await this.mailService.send({
        to: user.email,
        ...MailTemplate.verifyEmail(user.name || user.email, token.verification_token, originDomain),
      });
    } catch (error) {
      // log error
      throw new HttpException(HttpStatus.InternalServerError, "Failed to send verification email");
    }

    return user;
  }

  public async getUserById(id: string): Promise<IUser> {
    const user = await this.userQuery.getUserById(id);
    if (!user) {
      throw new HttpException(HttpStatus.BadRequest, "User does not exist");
    }
    return user;
  }

  public async getItems(): Promise<IUser[]> {
    return this.repo.findAll();
  }

  public async changeStatus(model: ChangeStatusDto): Promise<void> {
    await checkEmptyObject(model);

    // 1. Get user
    const user = await this.getUserById(model.user_id);
    if (!user) {
      throw new HttpException(HttpStatus.BadRequest, "User does not exist");
    }

    // 2. Check change status
    if (user.is_active === model.status) {
      throw new HttpException(HttpStatus.BadRequest, `User status is same as before`);
    }

    // 3. Update user via Query
    const updatedUser = await this.userQuery.updateUser(user._id.toString(), {
      is_active: model.status,
      updated_at: new Date(),
    });

    if (!updatedUser) {
      throw new HttpException(HttpStatus.BadRequest, "Update user status failed!");
    }
  }

//   public async updateUser(userId: string, model: UpdateUserDto, loggedUser: AuthUser): Promise<IUser> {
//     await checkEmptyObject(model);

//     // 1. Get target user
//     const user = await this.getUserById(userId);
//     if (!user) {
//       throw new HttpException(HttpStatus.BadRequest, "User does not exist");
//     }

//     // 2. Check email duplicate (exclude current user)
//     if (model.email && model.email !== user.email) {
//       await this.userValidation.validEmailUnique(model.email, user._id.toString());
//     }

//     // 3. Self update → luôn cho phép
//     if (loggedUser.id === userId) {
//       return this.userQuery.updateUser(userId, {
//         ...model,
//         updated_at: new Date(),
//       });
//     }

//     // 4. Phải có context nếu update user khác
//     const context = loggedUser.context;
//     if (!context) {
//       throw new HttpException(HttpStatus.Forbidden, "Context not selected");
//     }

//     // 5. SUPER_ADMIN (GLOBAL) → update tất cả
//     if (context.scope === RoleScope.GLOBAL && context.role === BaseRole.SUPER_ADMIN) {
//       return this.userQuery.updateUser(userId, {
//         ...model,
//         updated_at: new Date(),
//       });
//     }

//     // 6. MANAGER (FRANCHISE) → chỉ update user cùng franchise
//     if (context.scope === RoleScope.FRANCHISE && context.role === BaseRole.MANAGER) {
//       const isSameFranchise = await this.userFranchiseRoleRepo.exists({
//         user_id: userId,
//         franchise_id: context.franchiseId,
//         is_deleted: false,
//       });

//       if (!isSameFranchise) {
//         throw new HttpException(HttpStatus.Forbidden, "You can only update users in your franchise");
//       }

//       return this.userQuery.updateUser(userId, {
//         ...model,
//         updated_at: new Date(),
//       });
//     }

//     // 7. Còn lại → cấm
//     throw new HttpException(HttpStatus.Forbidden, "You don't have permission to update this user");
//   }
}
