import { NextFunction, Request, Response } from "express";
import { BaseCrudController } from "../../core/controller";
import { HttpStatus } from "../../core/enums";
import { formatResponse } from "../../core/utils";
import { IUserFranchiseRole } from "./user-franchise-role.interface";
import { mapItemToResponse } from "./user-franchise-role.mapper";
import UserFranchiseRoleService from "./user-franchise-role.service";
import CreateUserFranchiseRoleDto from "./dto/create.dto";
import { UserFranchiseRoleResponseDto } from "./dto/item.dto";
import { SearchPaginationItemDto } from "./dto/search.dto";
import UpdateUserFranchiseRoleDto from "./dto/update.dto";

export default class UserFranchiseRoleController extends BaseCrudController<
  IUserFranchiseRole,
  CreateUserFranchiseRoleDto,
  UpdateUserFranchiseRoleDto,
  SearchPaginationItemDto,
  UserFranchiseRoleResponseDto,
  UserFranchiseRoleService
> {
  constructor(service: UserFranchiseRoleService) {
    super(service, mapItemToResponse);
  }

  public getAllRolesByUserId = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.params;
      const items: IUserFranchiseRole[] = await this.service.getAllRolesByUserId(userId);
      res.status(HttpStatus.Success).json(formatResponse<UserFranchiseRoleResponseDto[]>(items.map(mapItemToResponse)));
    } catch (error) {
      next(error);
    }
  };
}
