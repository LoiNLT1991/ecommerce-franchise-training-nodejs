import { BaseModule } from "../../core/modules";
import RoleController from "./role.controller";
import { IRoleQuery } from "./role.interface";
import { RoleRepository } from "./role.repository";
import RoleRoute from "./role.route";
import RoleService from "./role.service";

export class RoleModule extends BaseModule<RoleRoute> {
  private readonly roleQuery: IRoleQuery;

  constructor() {
    super();

    // Internal dependencies
    const repo = new RoleRepository();

    // Core service and HTTP layer
    const service = new RoleService(repo);
    const controller = new RoleController(service);
    this.route = new RoleRoute(controller);

    // Expose ONLY interface
    this.roleQuery = service;
  }

  public getRoleQuery(): IRoleQuery {
    return this.roleQuery;
  }
}
