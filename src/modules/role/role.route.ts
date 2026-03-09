import { Router } from "express";
import { API_PATH } from "../../core/constants";
import { BaseRole } from "../../core/enums";
import { IRoute } from "../../core/interfaces";
import { adminAuthMiddleware, requireGlobalRole } from "../../core/middleware";
import RoleController from "./role.controller";

export default class RoleRoute implements IRoute {
  public path = API_PATH.ROLE;
  public router = Router();

  constructor(private readonly controller: RoleController) {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    /**
     * @swagger
     * tags:
     *   - name: Role
     *     description: Role related endpoints
     */

    // GET domain:/api/roles/migrate - Migrate roles
    this.router.get(
      API_PATH.ROLE_MIGRATE,
      adminAuthMiddleware(),
      requireGlobalRole(),
      this.controller.migrateRoles,
    );

    // GET domain:/api/roles/select - Get all roles for select option
    this.router.get(API_PATH.ROLE_SELECT, adminAuthMiddleware(), this.controller.getAllRoles);
  }
}
