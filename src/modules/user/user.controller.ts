import { NextFunction, Request, Response } from "express";
import { HttpStatus } from "../../core/enums";
import { formatResponse } from "../../core/utils";
import ChangeStatusDto from "./dto/changeStatus.dto";
import CreateUserDto from "./dto/create.dto";
import UpdateUserDto from "./dto/update.dto";
import { IUser, UserResponseDto } from "./index";
import { mapItemToResponse } from "./user.mapper";
import UserService from "./user.service";
import { BaseCrudController } from "../../core";
import { SearchPaginationItemDto } from "./dto/search.dto";

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

  public changeStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const model: ChangeStatusDto = req.body;
      await this.service.changeStatus(model);
      res.status(HttpStatus.Success).json(formatResponse<null>(null));
    } catch (error) {
      next(error);
    }
  };
}
