import { BaseModule } from "../../core/modules";
import { AuditLogModule } from "../audit-log";
import { FranchiseModule } from "../franchise";
import { RoleModule } from "../role";
import { UserModule } from "../user";
import UserFranchiseRoleController from "./user-franchise-role.controller";
import { IUserFranchiseRoleQuery } from "./user-franchise-role.interface";
import { UserFranchiseRoleRepository } from "./user-franchise-role.repository";
import UserFranchiseRoleRoute from "./user-franchise-role.route";
import UserFranchiseRoleService from "./user-franchise-role.service";

export class UserFranchiseRoleModule extends BaseModule<UserFranchiseRoleRoute> {
  private readonly userContextProvider: IUserFranchiseRoleQuery;

  constructor() {
    super();

    // Internal dependencies
    const auditLogModule = new AuditLogModule();
    const userModule = new UserModule();
    const roleModule = new RoleModule();
    const franchiseModule = new FranchiseModule();
    const repo = new UserFranchiseRoleRepository();

    // Core service and HTTP layer
    const service = new UserFranchiseRoleService(
      repo,
      auditLogModule.getAuditLogger(),
      userModule.getUserQuery(),
      roleModule.getRoleQuery(),
      franchiseModule.getFranchiseQuery(),
    );
    const controller = new UserFranchiseRoleController(service);
    this.route = new UserFranchiseRoleRoute(controller);

    // Expose ONLY interface
    this.userContextProvider = service;
  }

  public getUserContext(): IUserFranchiseRoleQuery {
    return this.userContextProvider;
  }
}
