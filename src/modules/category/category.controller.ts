import { NextFunction, Request, Response } from "express";
import { BaseCrudController } from "../../core/controller";
import { HttpStatus } from "../../core/enums";
import { mapItemToSelect } from "../../core/mappers";
import { BaseItemSelectDto } from "../../core/models";
import { formatResponse } from "../../core/utils";
import { ICategory } from "./category.interface";
import { mapItemToResponse } from "./category.mapper";
import { CategoryService } from "./category.service";
import CreateCategoryDto from "./dto/create.dto";
import { CategoryItemDto } from "./dto/item.dto";
import { SearchPaginationItemDto } from "./dto/search.dto";
import UpdateCategoryDto from "./dto/update.dto";

export class CategoryController extends BaseCrudController<
  ICategory,
  CreateCategoryDto,
  UpdateCategoryDto,
  SearchPaginationItemDto,
  CategoryItemDto,
  CategoryService
> {
  constructor(service: CategoryService) {
    super(service, mapItemToResponse);
  }

  public getAllCategories = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const categories = await this.service.getAllCategories();
      res.status(HttpStatus.Success).json(formatResponse<BaseItemSelectDto[]>(categories.map(mapItemToSelect)));
    } catch (error) {
      next(error);
    }
  };
}
