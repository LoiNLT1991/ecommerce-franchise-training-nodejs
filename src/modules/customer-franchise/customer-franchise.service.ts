import { Types } from "mongoose";
import { BaseCrudService, BaseFieldName, HttpException, HttpStatus, MSG_BUSINESS } from "../../core";
import { AuditAction, AuditEntityType, IAuditLogger, pickAuditSnapshot } from "../audit-log";
import { ICustomerQuery } from "../customer";
import { IFranchiseQuery } from "../franchise";
import { ICustomerFranchise, ICustomerFranchiseQuery } from "./customer-franchise.interface";
import { CustomerFranchiseRepository } from "./customer-franchise.repository";
import CreateCustomerFranchiseDto from "./dto/create.dto";
import { SearchPaginationItemDto } from "./dto/search.dto";
import UpdateCustomerFranchiseDto from "./dto/update.dto";

export const AUDIT_FIELDS_ITEM = [
  BaseFieldName.FRANCHISE_ID,
  BaseFieldName.CUSTOMER_ID,
  BaseFieldName.LOYALTY_POINTS,
  BaseFieldName.LOYALTY_TIER,
  BaseFieldName.TOTAL_EARNED_POINTS,
  BaseFieldName.FIRST_ORDER_DATE,
  BaseFieldName.LAST_ORDER_DATE,
] as readonly (keyof ICustomerFranchise)[];

export default class CustomerFranchiseService
  extends BaseCrudService<
    ICustomerFranchise,
    CreateCustomerFranchiseDto,
    UpdateCustomerFranchiseDto,
    SearchPaginationItemDto
  >
  implements ICustomerFranchiseQuery
{
  private readonly customerFranchiseRepo: CustomerFranchiseRepository;

  constructor(
    repo: CustomerFranchiseRepository,
    private readonly auditLogger: IAuditLogger,
    private readonly franchiseQuery: IFranchiseQuery,
    private readonly customerQuery: ICustomerQuery,
  ) {
    super(repo);
    this.customerFranchiseRepo = repo;
  }

  // ===== Start CRUD =====
  protected async doSearch(dto: SearchPaginationItemDto): Promise<{ data: ICustomerFranchise[]; total: number }> {
    return this.customerFranchiseRepo.getItems(dto);
  }

  public async getItem(id: string): Promise<ICustomerFranchise> {
    const item = await this.customerFranchiseRepo.getItem(id);
    if (!item) {
      throw new HttpException(HttpStatus.BadRequest, MSG_BUSINESS.ITEM_NOT_FOUND);
    }
    return item;
  }
  // ===== END CRUD =====

  // Interface ICustomerFranchiseQuery
  public async createItem(
    payload: CreateCustomerFranchiseDto,
    loggedUserId: string,
  ): Promise<ICustomerFranchise | null> {
    const { franchise_id, customer_id } = payload;

    // Validate customer
    const customer = await this.customerQuery.getById(customer_id);
    if (!customer) {
      throw new HttpException(HttpStatus.BadRequest, "Customer not found");
    }

    // Validate franchise
    const franchise = await this.franchiseQuery.getById(franchise_id);
    if (!franchise) {
      throw new HttpException(HttpStatus.BadRequest, "Franchise not found");
    }

    const customerObjectId = new Types.ObjectId(customer_id);
    const franchiseObjectId = new Types.ObjectId(franchise_id);

    // Check customer existed in CustomerFranchise with the same franchise_id or not
    const existing = await this.customerFranchiseRepo.findOne({
      customer_id: customerObjectId,
      franchise_id: franchiseObjectId,
      is_deleted: false,
    });
    if (existing) {
      throw new HttpException(HttpStatus.BadRequest, "Customer already belongs to this franchise");
    }

    // Create new CustomerFranchise
    const item = await this.repo.create({
      ...payload,
      customer_id: customerObjectId,
      franchise_id: franchiseObjectId,
    });

    // Audit Log
    const snapshot = pickAuditSnapshot(item, AUDIT_FIELDS_ITEM);
    await this.auditLogger.log({
      entityType: AuditEntityType.CUSTOMER_FRANCHISE,
      entityId: String(item._id),
      action: AuditAction.CREATE,
      newData: snapshot,
      changedBy: loggedUserId,
    });

    return item;
  }
}
