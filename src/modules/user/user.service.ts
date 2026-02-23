import { HttpStatus } from "../../core/enums";
import { HttpException } from "../../core/exceptions";
import { BaseCrudService, MailService, MailTemplate } from "../../core/services";
import { checkEmptyObject, encodePassword, withTransaction } from "../../core/utils";
import { createTokenVerifiedUser } from "../../core/utils/helpers";
import ChangeStatusDto from "./dto/changeStatus.dto";
import CreateUserDto from "./dto/create.dto";
import { SearchPaginationItemDto } from "./dto/search.dto";
import UpdateUserDto from "./dto/update.dto";
import { IUser, IUserQuery, IUserValidation } from "./user.interface";
import { UserRepository } from "./user.repository";

export default class UserService extends BaseCrudService<IUser, CreateUserDto, UpdateUserDto, SearchPaginationItemDto> {
  private readonly userRepo: UserRepository;

  constructor(
    repo: UserRepository,
    private readonly userValidation: IUserValidation,
    private readonly userQuery: IUserQuery,
    private readonly mailService: MailService,
  ) {
    super(repo);
    this.userRepo = repo;
  }

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

  protected async doSearch(dto: SearchPaginationItemDto): Promise<{ data: IUser[]; total: number }> {
    return this.userRepo.getItems(dto);
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
}
