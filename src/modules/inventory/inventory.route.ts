import { Router } from "express";
import {
  API_PATH,
  adminAuthMiddleware,
  IRoute,
  requireMoreContext,
  SYSTEM_AND_FRANCHISE_ALL_ROLES,
  SYSTEM_AND_FRANCHISE_MANAGER_ROLES,
  validationMiddleware,
  validationBulkMiddleware,
} from "../../core";
import { CreateInventoryDto } from "./dto/create.dto";
import { SearchPaginationItemDto } from "./dto/search.dto";
import { BulkAdjustInventoryDto, UpdateInventoryQuantityDto } from "./dto/update.dto";
import InventoryController from "./inventory.controller";

export default class InventoryRoute implements IRoute {
  public path = API_PATH.INVENTORY;
  public router = Router();

  constructor(private readonly controller: InventoryController) {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    /**
     * @swagger
     * tags:
     *   - name: Inventory
     *     description: Inventory related endpoints
     */

    // ================= BUSINESS =================

    // POST /api/inventories/adjust
    this.router.post(
      API_PATH.INVENTORY_ADJUST,
      adminAuthMiddleware(),
      requireMoreContext(SYSTEM_AND_FRANCHISE_MANAGER_ROLES),
      validationMiddleware(UpdateInventoryQuantityDto),
      this.controller.adjustStock,
    );

    this.router.post(
      API_PATH.INVENTORY_ADJUST_BULK,
      adminAuthMiddleware(),
      requireMoreContext(SYSTEM_AND_FRANCHISE_MANAGER_ROLES),
      validationBulkMiddleware(UpdateInventoryQuantityDto),
      this.controller.adjustBulk,
    );

    // GET /api/inventories/low-stock/franchise/:franchiseId
    this.router.get(
      API_PATH.INVENTORY_LOW_STOCK_BY_FRANCHISE,
      adminAuthMiddleware(),
      requireMoreContext(SYSTEM_AND_FRANCHISE_MANAGER_ROLES),
      this.controller.getLowStock,
    );

    // ================= LOG =================

    // GET /api/inventories/logs/:inventoryId
    this.router.get(
      API_PATH.INVENTORY_LOGS,
      adminAuthMiddleware(),
      requireMoreContext(SYSTEM_AND_FRANCHISE_MANAGER_ROLES),
      this.controller.getLogsByInventory,
    );

    // GET /api/inventories/logs/reference?referenceType=ORDER&referenceId=xxx
    this.router.get(
      API_PATH.INVENTORY_LOGS_BY_REFERENCE,
      adminAuthMiddleware(),
      requireMoreContext(SYSTEM_AND_FRANCHISE_MANAGER_ROLES),
      this.controller.getLogsByReference,
    );

    // ================= CRUD =================

    // POST /api/inventories - Create inventory
    this.router.post(
      this.path,
      adminAuthMiddleware(),
      requireMoreContext(SYSTEM_AND_FRANCHISE_MANAGER_ROLES),
      validationMiddleware(CreateInventoryDto),
      this.controller.createItem,
    );

    // POST /api/inventories/search - Search inventory
    this.router.post(
      API_PATH.INVENTORY_SEARCH,
      adminAuthMiddleware(),
      requireMoreContext(SYSTEM_AND_FRANCHISE_ALL_ROLES),
      validationMiddleware(SearchPaginationItemDto, true),
      this.controller.getItems,
    );

    // GET /api/inventories/:id - Get detail
    this.router.get(
      API_PATH.INVENTORY_ID,
      adminAuthMiddleware(),
      requireMoreContext(SYSTEM_AND_FRANCHISE_ALL_ROLES),
      this.controller.getItem,
    );

    // DELETE /api/inventories/:id - Soft delete (optional)
    this.router.delete(
      API_PATH.INVENTORY_ID,
      adminAuthMiddleware(),
      requireMoreContext(SYSTEM_AND_FRANCHISE_MANAGER_ROLES),
      this.controller.softDeleteItem,
    );

    // PATCH /api/inventories/:id/restore
    this.router.patch(
      API_PATH.INVENTORY_RESTORE,
      adminAuthMiddleware(),
      requireMoreContext(SYSTEM_AND_FRANCHISE_MANAGER_ROLES),
      this.controller.restoreItem,
    );
  }
}
