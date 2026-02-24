import { NextFunction, Request, Response } from "express";
import { AuthenticatedRequest, BaseCrudController } from "../../core";
import { HttpStatus } from "../../core/enums";
import { formatResponse } from "../../core/utils";
import CreateUserDto from "./dto/create.dto";
import { SearchPaginationItemDto } from "./dto/search.dto";
import UpdateUserDto from "./dto/update.dto";
import { IUser, UserResponseDto } from "./index";
import { mapItemToResponse } from "./user.mapper";
import UserService from "./user.service";

export default class UserController extends BaseCrudController<
  IUser,
  CreateUserDto,
  UpdateUserDto,
  SearchPaginationItemDto,
  UserResponseDto,
  UserService
> {
  constructor(service: UserService) {
    super(service, mapItemToResponse);
  }

  // Override createItem to include user ID and Origin header
  public createItem = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const item = await this.service.createUser(req.body, (req as AuthenticatedRequest).user.id, req.get("Origin"));
      res.status(HttpStatus.Success).json(formatResponse(this.mapToResponse(item)));
    } catch (error) {
      next(error);
    }
  };

  public changeStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      await this.service.changeStatus(id, req.body, (req as AuthenticatedRequest).user.id);
      res.status(HttpStatus.Success).json(formatResponse<null>(null));
    } catch (error) {
      next(error);
    }
  };
}
