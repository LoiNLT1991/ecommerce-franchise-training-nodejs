import { BaseCrudService } from "../../core";
import { MSG_BUSINESS } from "../../core/constants";
import { UpdateStatusDto } from "../../core/dto";
import { BaseFieldName, HttpStatus } from "../../core/enums";
import { HttpException } from "../../core/exceptions";
import { IError } from "../../core/interfaces";
import { checkEmptyObject } from "../../core/utils";
import { AuditAction, AuditEntityType, IAuditLogger, pickAuditSnapshot } from "../audit-log";
import { ICategoryQuery } from "../category";
import { IFranchiseQuery } from "../franchise";
import { ICategoryFranchise, ICategoryFranchiseQuery } from "./category-franchise.interface";
import { mapItemToResponse } from "./category-franchise.mapper";
import { CategoryFranchiseRepository } from "./category-franchise.repository";
import CreateCategoryFranchiseDto from "./dto/create.dto";
import { CategoryFranchiseItemDto } from "./dto/item.dto";
import { SearchPaginationItemDto } from "./dto/search.dto";
import UpdateCategoryFranchiseDto from "./dto/update.dto";
import { UpdateDisplayOrderItemDto, UpdateDisplayOrderItemsDto } from "./dto/updateDisplayOrder.dto";

const AUDIT_FIELDS_ITEM = [
  BaseFieldName.CATEGORY_ID,
  BaseFieldName.FRANCHISE_ID,
  BaseFieldName.DISPLAY_ORDER,
] as readonly (keyof ICategoryFranchise)[];

export class CategoryFranchiseService
  extends BaseCrudService<
    ICategoryFranchise,
    CreateCategoryFranchiseDto,
    UpdateCategoryFranchiseDto,
    SearchPaginationItemDto
  >
  implements ICategoryFranchiseQuery
{
  private readonly categoryFranchiseRepo: CategoryFranchiseRepository;

  constructor(
    repo: CategoryFranchiseRepository,
    private readonly categoryQuery: ICategoryQuery,
    private readonly franchiseQuery: IFranchiseQuery,
    private readonly auditLogger: IAuditLogger,
  ) {
    super(repo);
    this.categoryFranchiseRepo = repo;
  }

  // ===== Start CRUD =====
  protected async beforeCreate(dto: CreateCategoryFranchiseDto, loggedUserId: string): Promise<void> {
    await checkEmptyObject(dto);

    const { franchise_id, category_id } = dto;
    const errors: IError[] = [];

    // 1. Validate franchise
    const franchise = await this.franchiseQuery.getById(franchise_id);
    if (!franchise) {
      errors.push({
        field: BaseFieldName.FRANCHISE_ID,
        message: MSG_BUSINESS.ITEM_NOT_FOUND_WITH_NAME("Franchise"),
      });
    }

    // 2. Validate category
    const category = await this.categoryQuery.getById(category_id);
    if (!category) {
      errors.push({
        field: BaseFieldName.CATEGORY_ID,
        message: MSG_BUSINESS.ITEM_NOT_FOUND_WITH_NAME("Category"),
      });
    }

    // 3. Prevent duplicate
    const existed = await this.categoryFranchiseRepo.findByCategoryAndFranchise(category_id, franchise_id);

    if (existed) {
      if (existed.is_deleted) {
        await this.repo.restoreById(String(existed._id));
        return;
      }

      errors.push({
        field: BaseFieldName.CATEGORY_ID,
        message: MSG_BUSINESS.ITEM_EXISTS("Category in franchise"),
      });
    }

    if (errors.length) {
      throw new HttpException(HttpStatus.BadRequest, "", errors);
    }

    // default display order
    if (!dto.display_order) {
      dto.display_order = 1;
    }
  }

  protected async afterCreate(item: ICategoryFranchise, loggedUserId: string): Promise<void> {
    const snapshot = pickAuditSnapshot(item, AUDIT_FIELDS_ITEM);
    await this.auditLogger.log({
      entityType: AuditEntityType.CATEGORY_FRANCHISE,
      entityId: String(item._id),
      action: AuditAction.CREATE,
      newData: snapshot,
      changedBy: loggedUserId,
    });
  }

  protected async afterDelete(item: ICategoryFranchise, loggedUserId: string): Promise<void> {
    await this.auditLogger.log({
      entityType: AuditEntityType.CATEGORY_FRANCHISE,
      entityId: String(item._id),
      action: AuditAction.SOFT_DELETE,
      oldData: { is_deleted: false },
      newData: { is_deleted: true },
      changedBy: loggedUserId,
    });
  }

  protected async afterRestore(item: ICategoryFranchise, loggedUserId: string): Promise<void> {
    await this.auditLogger.log({
      entityType: AuditEntityType.CATEGORY_FRANCHISE,
      entityId: String(item._id),
      action: AuditAction.RESTORE,
      oldData: { is_deleted: true },
      newData: { is_deleted: false },
      changedBy: loggedUserId,
    });
  }

  protected async doSearch(dto: SearchPaginationItemDto): Promise<{ data: ICategoryFranchise[]; total: number }> {
    return this.categoryFranchiseRepo.getItems(dto);
  }
  // ===== End CRUD =====

  /**
   * Get menu categories of a franchise
   */
  public async getCategoriesByFranchise(
    franchiseId: string,
    isActive: boolean | undefined,
  ): Promise<CategoryFranchiseItemDto[]> {
    const items = (await this.categoryFranchiseRepo
      .findByFranchise(franchiseId, isActive)
      .populate("category_id", "name")
      .populate("franchise_id", "name")) as unknown as ICategoryFranchise[];

    return items.map(mapItemToResponse);
  }

  /**
   * Update active status
   */
  public async changeStatus(id: string, dto: UpdateStatusDto, loggedUserId: string): Promise<void> {
    const { is_active } = dto;

    const currentItem = await this.getActiveItemOrThrow(id);

    if (currentItem.is_active === is_active) {
      throw new HttpException(HttpStatus.BadRequest, MSG_BUSINESS.STATUS_NO_CHANGE);
    }

    // 1. Update status
    await this.repo.update(id, { is_active });

    // 2. Audit log
    await this.auditLogger.log({
      entityType: AuditEntityType.CATEGORY_FRANCHISE,
      entityId: id,
      action: AuditAction.CHANGE_STATUS,
      oldData: { is_active: currentItem.is_active },
      newData: { is_active },
      changedBy: loggedUserId,
    });
  }

  /**
   * Update display order
   */
  public async changeDisplayOrderItem(dto: UpdateDisplayOrderItemDto, loggedUserId: string): Promise<void> {
    const { display_order, id } = dto;

    const currentItem = await this.getActiveItemOrThrow(id);

    if (currentItem.display_order === display_order) {
      throw new HttpException(HttpStatus.BadRequest, MSG_BUSINESS.NO_DATA_TO_UPDATE);
    }

    // 1. Update display order
    await this.repo.update(id, { display_order });

    // 2. Audit log
    await this.auditLogger.log({
      entityType: AuditEntityType.CATEGORY_FRANCHISE,
      entityId: id,
      action: AuditAction.DISPLAY_ORDER,
      oldData: { display_order: currentItem.display_order },
      newData: { display_order },
      changedBy: loggedUserId,
    });
  }

  /**
   * Reorder menu categories (drag & drop)
   */
  public async reorderCategories(dto: UpdateDisplayOrderItemsDto, loggedUserId: string): Promise<void> {
    const { franchise_id, items } = dto;

    if (!items || items.length === 0) {
      throw new HttpException(HttpStatus.BadRequest, MSG_BUSINESS.ITEMS_NOT_FOUND);
    }

    // 1. Validate no duplicate ids in the request
    const uniqueIds = new Set(items.map((i) => i.id));
    if (uniqueIds.size !== items.length) {
      throw new HttpException(HttpStatus.BadRequest, MSG_BUSINESS.DUPLICATE_IDS_IN_REQUEST("CategoryFranchise"));
    }

    // 2. Get current items in the franchise
    const currentItems = await this.categoryFranchiseRepo.findByFranchise(franchise_id, undefined);

    const currentMap = new Map(currentItems.map((item) => [item._id.toString(), item]));

    // 3. Validate all items belong to this franchise
    for (const item of items) {
      const current = currentMap.get(item.id);
      if (!current) {
        throw new HttpException(
          HttpStatus.BadRequest,
          `CategoryFranchise ${item.id} does not belong to this franchise`,
        );
      }
    }

    // 3. Check if there is any actual change
    const hasChange = items.some((item) => {
      const current = currentMap.get(item.id)!;
      return current.display_order !== item.display_order;
    });

    if (!hasChange) {
      throw new HttpException(HttpStatus.BadRequest, MSG_BUSINESS.NO_DATA_TO_UPDATE);
    }

    // 4. Bulk update (should be in transaction if Mongo session is used)
    await this.categoryFranchiseRepo.bulkUpdateOrder(items);

    // 5. Audit log (summary log – do not log each item)
    await this.auditLogger.log({
      entityType: AuditEntityType.CATEGORY_FRANCHISE,
      entityId: franchise_id,
      action: AuditAction.DISPLAY_ORDER,
      note: "Reorder category menu",
      oldData: currentItems.map((i) => ({
        id: i._id,
        display_order: i.display_order,
      })),
      newData: items,
      changedBy: loggedUserId,
    });
  }

  private async getActiveItemOrThrow(id: string) {
    const item = await this.repo.findById(id);
    if (!item || item.is_deleted) {
      throw new HttpException(HttpStatus.NotFound, MSG_BUSINESS.ITEM_NOT_FOUND_WITH_NAME("CategoryFranchise"));
    }
    return item;
  }

  // Support for ICategoryFranchiseQuery
  public async getById(id: string): Promise<ICategoryFranchise | null> {
    return this.repo.findById(id);
  }
}
