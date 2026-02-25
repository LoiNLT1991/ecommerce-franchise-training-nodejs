import { NextFunction, Request, Response } from "express";
import { BaseCrudController } from "../../core/controller";
import { UpdateStatusDto } from "../../core/dto";
import { HttpStatus } from "../../core/enums";
import { mapItemToSelect } from "../../core/mappers";
import { AuthenticatedUserRequest, BaseItemSelectDto } from "../../core/models";
import { formatResponse } from "../../core/utils";
import CreateFranchiseDto from "./dto/create.dto";
import { FranchiseItemDto } from "./dto/item.dto";
import { SearchPaginationItemDto } from "./dto/search.dto";
import UpdateFranchiseDto from "./dto/update.dto";
import { IFranchise } from "./franchise.interface";
import { mapItemToResponse } from "./franchise.mapper";
import FranchiseService from "./franchise.service";

export default class FranchiseController extends BaseCrudController<
  IFranchise,
  CreateFranchiseDto,
  UpdateFranchiseDto,
  SearchPaginationItemDto,
  FranchiseItemDto,
  FranchiseService
> {
  constructor(service: FranchiseService) {
    super(service, mapItemToResponse);
  }

  public changeStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const payload: UpdateStatusDto = req.body;
      await this.service.changeStatus(id, payload, (req as AuthenticatedUserRequest).user.id);
      res.status(HttpStatus.Success).json(formatResponse<null>(null));
    } catch (error) {
      next(error);
    }
  };

  public getAllFranchises = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const franchises = await this.service.getAllFranchises();
      res.status(HttpStatus.Success).json(formatResponse<BaseItemSelectDto[]>(franchises.map(mapItemToSelect)));
    } catch (error) {
      next(error);
    }
  };
}
