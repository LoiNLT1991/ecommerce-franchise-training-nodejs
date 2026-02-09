import { NextFunction, Request, Response } from "express";
import { HttpStatus } from "../../core/enums";
import { formatResponse } from "../../core/utils";
import ChangeStatusDto from "./dto/changeStatus.dto";
import CreateUserDto from "./dto/create.dto";
import UpdateUserDto from "./dto/update.dto";
import { IUser, UserResponseDto } from "./index";
import { mapUserToResponse } from "./user.mapper";
import UserService from "./user.service";

export default class UserController {
  constructor(private readonly userService: UserService) {}

  public createItem = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const model: CreateUserDto = req.body;
      const user: IUser = await this.userService.createUser(model);
      res.status(HttpStatus.Success).json(formatResponse<UserResponseDto>(mapUserToResponse(user)));
    } catch (error) {
      next(error);
    }
  };

  public getItem = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const user: IUser = await this.userService.getUserById(id);
      res.status(HttpStatus.Success).json(formatResponse<UserResponseDto>(mapUserToResponse(user)));
    } catch (error) {
      next(error);
    }
  };

    public getItems = async (req: Request, res: Response, next: NextFunction) => {
      try {
        const users = await this.userService.getItems();
        res.status(HttpStatus.Success).json(formatResponse<UserResponseDto[]>(users.map(mapUserToResponse)));
      } catch (error) {
        next(error);
      }
    };

  public changeStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const model: ChangeStatusDto = req.body;
      await this.userService.changeStatus(model);
      res.status(HttpStatus.Success).json(formatResponse<null>(null));
    } catch (error) {
      next(error);
    }
  };

//   public updateUser = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const { id } = req.params;
//       const model: UpdateUserDto = req.body;
//       const updatedUser: IUser = await this.userService.updateUser(id, model, req.user);
//       res.status(HttpStatus.Success).json(formatResponse<UserResponseDto>(mapUserToResponse(updatedUser)));
//     } catch (error) {
//       next(error);
//     }
//   };

  //   public deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  //     try {
  //       const { id } = req.params;
  //       await this.userService.deleteUser(id);
  //       res.status(HttpStatus.Success).json(formatResponse<null>(null));
  //     } catch (error) {
  //       next(error);
  //     }
  //   };
}
