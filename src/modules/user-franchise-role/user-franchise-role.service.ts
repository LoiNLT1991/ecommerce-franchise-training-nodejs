import { MSG_BUSINESS } from "../../core/constants";
import { GLOBAL_FRANCHISE_ID, HttpStatus, RoleScope } from "../../core/enums";
import { HttpException } from "../../core/exceptions";
import { IUserContext } from "../../core/models";
import { BaseCrudService } from "../../core/services";
import { checkEmptyObject } from "../../core/utils";
import { AuditAction, AuditEntityType, buildAuditDiff, IAuditLogger, pickAuditSnapshot } from "../audit-log";
import { IFranchiseQuery } from "../franchise";
import { IRoleQuery } from "../role";
import { IUserQuery } from "../user/user.interface";
import CreateUserFranchiseRoleDto from "./dto/create.dto";
import { SearchPaginationItemDto } from "./dto/search.dto";
import UpdateUserFranchiseRoleDto from "./dto/update.dto";
import { UserFranchiseRoleFieldName } from "./user-franchise-role.enum";
import { IUserFranchiseRole, IUserFranchiseRoleQuery } from "./user-franchise-role.interface";
import { UserFranchiseRoleRepository } from "./user-franchise-role.repository";

export const AUDIT_FIELDS_ITEM = [
  UserFranchiseRoleFieldName.FRANCHISE_ID,
  UserFranchiseRoleFieldName.ROLE_ID,
  UserFranchiseRoleFieldName.USER_ID,
  UserFranchiseRoleFieldName.NOTE,
] as readonly (keyof IUserFranchiseRole)[];

export default class UserFranchiseRoleService
  extends BaseCrudService<
    IUserFranchiseRole,
    CreateUserFranchiseRoleDto,
    UpdateUserFranchiseRoleDto,
    SearchPaginationItemDto
  >
  implements IUserFranchiseRoleQuery
{
  private readonly userFranchiseRoleRepo: UserFranchiseRoleRepository;

  constructor(
    repo: UserFranchiseRoleRepository,
    private readonly auditLogger: IAuditLogger,
    private readonly userQuery: IUserQuery,
    private readonly roleQuery: IRoleQuery,
    private readonly franchiseQuery: IFranchiseQuery,
  ) {
    super(repo);
    this.userFranchiseRoleRepo = repo;
  }

  // ===== Start CRUD =====
  protected async beforeCreate(dto: CreateUserFranchiseRoleDto, _loggedUserId: string): Promise<void> {
    const { user_id, role_id, franchise_id } = dto;

    // 1️⃣ Validate user
    const user = await this.userQuery.getUserById(user_id);
    if (!user) {
      throw new HttpException(HttpStatus.BadRequest, "User not found");
    }

    // 2️⃣ Validate role
    const role = await this.roleQuery.getRoleById(role_id);
    if (!role) {
      throw new HttpException(HttpStatus.BadRequest, "Role not found");
    }

    // 3️⃣ Validate scope
    if (role.scope === RoleScope.GLOBAL && franchise_id) {
      throw new HttpException(HttpStatus.BadRequest, "GLOBAL role must not be assigned to a franchise");
    }

    if (role.scope === RoleScope.FRANCHISE && !franchise_id) {
      throw new HttpException(HttpStatus.BadRequest, "FRANCHISE role must be assigned to a franchise");
    }

    // 4️⃣ Normalize franchise_id
    const normalizedFranchiseId = role.scope === RoleScope.GLOBAL ? GLOBAL_FRANCHISE_ID : franchise_id!;

    dto.franchise_id = normalizedFranchiseId;

    // 5️⃣ Check existing role in franchise / global
    const existing = await this.userFranchiseRoleRepo.findOne({
      user_id,
      franchise_id: normalizedFranchiseId,
      is_deleted: false,
    });
    if (existing) {
      throw new HttpException(HttpStatus.BadRequest, "User already has a role in this franchise or globally");
    }

    // 🔑 Check if user already has a global role
    if (role.scope === RoleScope.GLOBAL) {
      const existingGlobal = await this.userFranchiseRoleRepo.findOne({
        user_id,
        scope: RoleScope.GLOBAL,
        is_deleted: false,
      });
      if (existingGlobal) {
        throw new HttpException(HttpStatus.BadRequest, "User already has a global role");
      }
    }
  }

  protected async afterCreate(item: IUserFranchiseRole, loggedUserId: string): Promise<void> {
    const snapshot = pickAuditSnapshot(item, AUDIT_FIELDS_ITEM);

    await this.auditLogger.log({
      entityType: AuditEntityType.USER_FRANCHISE_ROLE,
      entityId: String(item._id),
      action: AuditAction.ASSIGN_ROLE_TO_USER,
      newData: snapshot,
      changedBy: loggedUserId,
    });
  }

  protected async beforeUpdate(
    current: IUserFranchiseRole,
    dto: UpdateUserFranchiseRoleDto,
    _loggedUserId: string,
  ): Promise<void> {
    await checkEmptyObject(dto);

    if (!dto.role_id || dto.role_id === current.role_id) {
      throw new HttpException(HttpStatus.BadRequest, MSG_BUSINESS.NO_DATA_TO_UPDATE);
    }

    const newRole = await this.roleQuery.getRoleById(dto.role_id);
    if (!newRole) {
      throw new HttpException(HttpStatus.BadRequest, MSG_BUSINESS.ITEM_NOT_FOUND_WITH_NAME("Role"));
    }

    if (newRole.scope === RoleScope.GLOBAL && current.franchise_id !== GLOBAL_FRANCHISE_ID) {
      throw new HttpException(HttpStatus.BadRequest, MSG_BUSINESS.CANNOT_CHANGE_TO_GLOBAL_ROLE);
    }

    if (newRole.scope === RoleScope.FRANCHISE && current.franchise_id === GLOBAL_FRANCHISE_ID) {
      throw new HttpException(HttpStatus.BadRequest, MSG_BUSINESS.CANNOT_CHANGE_TO_FRANCHISE_ROLE);
    }
  }

  protected async afterUpdate(
    oldItem: IUserFranchiseRole,
    newItem: IUserFranchiseRole,
    loggedUserId: string,
  ): Promise<void> {
    const { oldData, newData } = buildAuditDiff(oldItem, newItem, AUDIT_FIELDS_ITEM);

    if (newData && Object.keys(newData).length > 0) {
      await this.auditLogger.log({
        entityType: AuditEntityType.USER_FRANCHISE_ROLE,
        entityId: String(oldItem._id),
        action: AuditAction.UPDATE,
        oldData,
        newData,
        changedBy: loggedUserId,
      });
    }
  }

  protected async beforeDelete(item: IUserFranchiseRole, loggedUserId: string): Promise<void> {
    // Prevent user from removing own global role
    if (item.user_id === loggedUserId && item.franchise_id === GLOBAL_FRANCHISE_ID) {
      throw new HttpException(HttpStatus.BadRequest, MSG_BUSINESS.CANNOT_REMOVE_OWN_GLOBAL_ROLE);
    }
  }

  protected async afterDelete(item: IUserFranchiseRole, loggedUserId: string): Promise<void> {
    await this.auditLogger.log({
      entityType: AuditEntityType.USER_FRANCHISE_ROLE,
      entityId: String(item._id),
      action: AuditAction.SOFT_DELETE,
      oldData: { is_deleted: false },
      newData: { is_deleted: true },
      changedBy: loggedUserId,
    });
  }

  protected async beforeRestore(item: IUserFranchiseRole, _loggedUserId: string): Promise<void> {
    const existing = await this.userFranchiseRoleRepo.findOne({
      user_id: item.user_id,
      franchise_id: item.franchise_id,
      is_deleted: false,
    });

    // Check if user already has a role in this franchise
    if (existing) {
      throw new HttpException(HttpStatus.BadRequest, MSG_BUSINESS.USER_ALREADY_HAS_ROLE_IN_FRANCHISE);
    }
  }

  protected async afterRestore(item: IUserFranchiseRole, loggedUserId: string): Promise<void> {
    await this.auditLogger.log({
      entityType: AuditEntityType.USER_FRANCHISE_ROLE,
      entityId: String(item._id),
      action: AuditAction.RESTORE,
      oldData: { is_deleted: true },
      newData: { is_deleted: false },
      changedBy: loggedUserId,
    });
  }

  protected async doSearch(dto: SearchPaginationItemDto): Promise<{ data: IUserFranchiseRole[]; total: number }> {
    return this.userFranchiseRoleRepo.getItems(dto);
  }

  public async getItem(id: string): Promise<IUserFranchiseRole> {
    const item = await this.userFranchiseRoleRepo.getItem(id);
    if (!item) {
      throw new HttpException(HttpStatus.BadRequest, MSG_BUSINESS.ITEM_NOT_FOUND);
    }
    return item;
  }

  // ===== END CRUD =====

  // Get all franchise roles of a user by userId
  public async getAllRolesByUserId(userId: string): Promise<IUserFranchiseRole[]> {
    return this.userFranchiseRoleRepo.find({ user_id: userId, is_deleted: false });
  }

  // Interface method (not API)
  // 🔑 Get context of user from assignment
  public async getUserContexts(userId: string): Promise<IUserContext[]> {
    // 1️⃣ Lấy tất cả assignment của user
    const assignments = await this.userFranchiseRoleRepo.find({
      user_id: userId,
      is_deleted: false,
    });

    if (!assignments.length) {
      return [];
    }

    // 2️⃣ Lấy role detail
    const roleIds = [...new Set(assignments.map((a) => a.role_id))];
    const roles = await this.roleQuery.getByIds(roleIds);
    const roleMap = new Map(roles.map((r) => [r.id, r]));

    // 3️⃣ Lấy franchise_id cần join (chỉ FRANCHISE scope)
    const franchiseIds = [
      ...new Set(
        assignments.filter((a) => a.franchise_id && a.franchise_id !== GLOBAL_FRANCHISE_ID).map((a) => a.franchise_id!),
      ),
    ];

    // 4️⃣ Query franchise 1 lần
    const franchises = franchiseIds.length ? await this.franchiseQuery.getByIds(franchiseIds) : [];

    const franchiseMap = new Map(franchises.map((f) => [f.id, f.name]));

    // 5️⃣ Build user contexts
    return assignments
      .map((a) => {
        const role = roleMap.get(a.role_id);
        if (!role) return null;

        const isGlobal = role.scope === RoleScope.GLOBAL;

        return {
          role: role.code,
          scope: role.scope,
          franchise_id: isGlobal ? null : a.franchise_id,
          franchise_name: isGlobal ? null : (franchiseMap.get(a.franchise_id!) ?? null),
        };
      })
      .filter(Boolean) as IUserContext[];
  }
}
