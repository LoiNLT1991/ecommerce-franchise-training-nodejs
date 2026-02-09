import { BaseCrudController } from "../../core/controller";
import CreateProductDto from "./dto/create.dto";
import { ProductItemDto } from "./dto/item.dto";
import { SearchPaginationItemDto } from "./dto/search.dto";
import UpdateProductDto from "./dto/update.dto";
import { IProduct } from "./product.interface";
import { mapItemToResponse } from "./product.mapper";
import { ProductService } from "./product.service";

export class ProductController extends BaseCrudController<
  IProduct,
  CreateProductDto,
  UpdateProductDto,
  SearchPaginationItemDto,
  ProductItemDto,
  ProductService
> {
  constructor(service: ProductService) {
    super(service, mapItemToResponse);
  }
}
