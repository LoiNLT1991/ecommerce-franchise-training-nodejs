import {
    BaseCrudService,
    BaseFieldName,
    BaseRole,
    HttpException,
    HttpStatus,
    UserAuthPayload
} from "../../core";
import { IAuditLogger } from "../audit-log";
import { ICustomerQuery } from "../customer";
import { IFranchiseQuery } from "../franchise";
import { ICart } from "./cart.interface";
import { CartRepository } from "./cart.repository";
import { CreateCartDto } from "./dto/create.dto";
import { SearchPaginationItemDto } from "./dto/search.dto";
import UpdateCartDto from "./dto/update.dto";

const AUDIT_FIELDS_ITEM = [
  BaseFieldName.FRANCHISE_ID,
  BaseFieldName.CUSTOMER_ID,
  BaseFieldName.STAFF_ID,
] as readonly (keyof ICart)[];

export class CartService extends BaseCrudService<ICart, CreateCartDto, UpdateCartDto, SearchPaginationItemDto> {
  private readonly cartRepo: CartRepository;

  constructor(
    repo: CartRepository,
    private readonly auditLogger: IAuditLogger,
    private readonly franchiseQuery: IFranchiseQuery,
    private readonly customerQuery: ICustomerQuery,
  ) {
    super(repo);
    this.cartRepo = repo;
  }

  // ===== Start CRUD =====

  protected async doSearch(searchDto: SearchPaginationItemDto): Promise<{ data: ICart[]; total: number }> {
    return { data: [], total: 0 };
  }

  protected async getItemsByCondition(
    payload: SearchPaginationItemDto,
    loggedUser: UserAuthPayload,
  ): Promise<{ data: ICart[]; total: number }> {
    const { start_date, end_date } = payload.searchCondition;

    // Permission check
    if (loggedUser.context?.role !== BaseRole.SUPER_ADMIN && loggedUser.context?.role !== BaseRole.ADMIN) {
      if (loggedUser.context?.franchise_id) {
        payload.searchCondition.franchise_id = loggedUser.context?.franchise_id;
      }
    }

    // Validate
    if (start_date && end_date) {
      const start = new Date(start_date);
      const end = new Date(end_date);

      if (start > end) {
        throw new HttpException(HttpStatus.BadRequest, "Start_date must be <= end_date");
      }
    }

    return this.cartRepo.getItems(payload);
  }
  // ===== End CRUD =====
}
