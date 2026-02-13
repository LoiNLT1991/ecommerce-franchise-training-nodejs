import { NextFunction, Request, Response } from "express";
import { BaseCrudController } from "../../core/controller";
import { UpdateStatusDto } from "../../core/dto";
import { HttpStatus } from "../../core/enums";
import { AuthenticatedRequest } from "../../core/models";
import { formatResponse } from "../../core/utils";
import { CreateProductFranchiseDto } from "./dto/create.dto";
import { ProductFranchiseItemDto } from "./dto/item.dto";
import { SearchPaginationItemDto } from "./dto/search.dto";
import { UpdateProductFranchiseDto } from "./dto/update.dto";
import { IProductFranchise } from "./product-franchise.interface";
import { mapItemToResponse } from "./product-franchise.mapper";
import { ProductFranchiseService } from "./product-franchise.service";

export default class ProductFranchiseController extends BaseCrudController<
  IProductFranchise,
  CreateProductFranchiseDto,
  UpdateProductFranchiseDto,
  SearchPaginationItemDto,
  ProductFranchiseItemDto,
  ProductFranchiseService
> {
  constructor(service: ProductFranchiseService) {
    super(service, mapItemToResponse);
  }

  public changeStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const payload: UpdateStatusDto = req.body;
      await this.service.changeStatus(id, payload, (req as AuthenticatedRequest).user.id);
      res.status(HttpStatus.Success).json(formatResponse<null>(null));
    } catch (error) {
      next(error);
    }
  };
}
