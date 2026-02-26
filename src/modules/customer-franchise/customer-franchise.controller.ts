import { BaseCrudController } from "../../core";
import { ICustomerFranchise } from "./customer-franchise.interface";
import { mapItemToResponse } from "./customer-franchise.mapper";
import CustomerFranchiseService from "./customer-franchise.service";
import CreateCustomerFranchiseDto from "./dto/create.dto";
import { CustomerFranchiseItemDto } from "./dto/item.dto";
import { SearchPaginationItemDto } from "./dto/search.dto";
import UpdateCustomerFranchiseDto from "./dto/update.dto";

export default class CustomerFranchiseController extends BaseCrudController<
  ICustomerFranchise,
  CreateCustomerFranchiseDto,
  UpdateCustomerFranchiseDto,
  SearchPaginationItemDto,
  CustomerFranchiseItemDto,
  CustomerFranchiseService
> {
  constructor(service: CustomerFranchiseService) {
    super(service, mapItemToResponse);
  }
}
