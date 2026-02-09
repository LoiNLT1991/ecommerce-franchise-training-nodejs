import { NextFunction, Request, Response } from "express";
import { HttpStatus } from "../../core/enums";
import { formatResponse } from "../../core/utils";
import { RoleSelectDto } from "./dto/role.dto";
import { mapRoleToResponse } from "./role.mapper";
import RoleService from "./role.service";

export default class RoleController {
  constructor(private readonly service: RoleService) {}

  public migrateRoles = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.service.migrateDefaultRoles();
      res.status(HttpStatus.Success).json(formatResponse<null>(null));
    } catch (error) {
      next(error);
    }
  };

  public getAllRoles = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const roles = await this.service.getAllRoles();
      res.status(HttpStatus.Success).json(formatResponse<RoleSelectDto[]>(roles.map(mapRoleToResponse)));
    } catch (error) {
      next(error);
    }
  };
}
