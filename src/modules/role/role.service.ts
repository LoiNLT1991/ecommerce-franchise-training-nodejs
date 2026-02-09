import { Types } from "mongoose";
import { MSG_BUSINESS } from "../../core/constants";
import { BaseRole, HttpStatus, RoleScope } from "../../core/enums";
import { HttpException } from "../../core/exceptions";
import { IRole, IRoleQuery, RoleQueryResult } from "./role.interface";
import { RoleRepository } from "./role.repository";

export default class RoleService implements IRoleQuery {
  constructor(private readonly repo: RoleRepository) {}

  public async migrateDefaultRoles(): Promise<void> {
    const defaultRoles = [
      { code: BaseRole.SUPER_ADMIN, name: "Super Admin", scope: RoleScope.GLOBAL },
      { code: BaseRole.ADMIN, name: "Admin", scope: RoleScope.GLOBAL },
      { code: BaseRole.MANAGER, name: "Manager", scope: RoleScope.FRANCHISE },
      { code: BaseRole.STAFF, name: "Staff", scope: RoleScope.FRANCHISE },
      { code: BaseRole.SHIPPER, name: "Shipper", scope: RoleScope.FRANCHISE },
      { code: BaseRole.USER, name: "User", scope: RoleScope.FRANCHISE },
    ];

    const createdRoles: string[] = [];

    for (const role of defaultRoles) {
      const existed = await this.repo.existsByField("code", role.code);
      if (!existed) {
        await this.repo.create(role);
        createdRoles.push(role.code);
      }
    }

    if (!createdRoles.length) {
      throw new HttpException(HttpStatus.NotFound, MSG_BUSINESS.ROLE_MIGRATION_FAILED);
    }
  }

  public async getAllRoles(): Promise<IRole[]> {
    const roles = await this.repo.findAll();

    return roles.filter((role) => role.code !== BaseRole.SUPER_ADMIN);
  }

  // Implementation of IRoleQuery
  public async getByIds(ids: string[]): Promise<RoleQueryResult[]> {
    const objectIds = ids.map((id) => new Types.ObjectId(id));

    const roles = await this.repo.find({
      _id: { $in: objectIds },
      is_deleted: false,
    });

    return roles.map((r) => ({
      id: r._id.toString(),
      code: r.code,
      scope: r.scope,
    }));
  }

  public async getRoleById(id: string): Promise<IRole | null> {
    return this.repo.findById(id);
  }
}
