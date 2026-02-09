import { Router } from "express";
import { API_PATH, BASE_ROLE_SYSTEM } from "../../core/constants";
import { IRoute } from "../../core/interfaces";
import { authMiddleware, requireGlobalRole, requireMoreContext, validationMiddleware } from "../../core/middleware";
import CreateFranchiseDto from "./dto/create.dto";
import { SearchPaginationItemDto } from "./dto/search.dto";
import UpdateFranchiseDto from "./dto/update.dto";
import UpdateStatusDto from "./dto/updateStatus.dto";
import FranchiseController from "./franchise.controller";

export default class FranchiseRoute implements IRoute {
  public path = API_PATH.FRANCHISE;
  public router = Router();

  constructor(private readonly controller: FranchiseController) {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    /**
     * @swagger
     * tags:
     *   - name: Franchise
     *     description: Franchise related endpoints
     */

    // GET domain:/api/franchises/select - Get all franchises for select option
    this.router.get(API_PATH.FRANCHISE_SELECT, this.controller.getAllFranchises);

    // PATCH domain:/api/franchises/:id/status - Update status franchise
    this.router.patch(
      API_PATH.FRANCHISE_CHANGE_STATUS,
      authMiddleware(),
      requireMoreContext(BASE_ROLE_SYSTEM),
      validationMiddleware(UpdateStatusDto),
      this.controller.changeStatus,
    );

    // POST domain:/api/franchises - Create franchise
    this.router.post(
      this.path,
      authMiddleware(),
      requireGlobalRole(),
      validationMiddleware(CreateFranchiseDto),
      this.controller.createItem,
    );

    // GET domain:/api/franchises/:id - Get franchise by id
    this.router.get(API_PATH.FRANCHISE_ID, authMiddleware(), this.controller.getItem);

    // POST domain:/api/franchises/search - Get all franchises
    this.router.post(
      API_PATH.FRANCHISE_SEARCH,
      authMiddleware(),
      validationMiddleware(SearchPaginationItemDto, true, {
        enableImplicitConversion: false,
      }),
      this.controller.getItems,
    );

    // PUT domain:/api/franchises/:id - Update franchise
    this.router.put(
      API_PATH.FRANCHISE_ID,
      authMiddleware(),
      requireMoreContext(BASE_ROLE_SYSTEM),
      validationMiddleware(UpdateFranchiseDto),
      this.controller.updateItem,
    );

    // DELETE domain:/api/franchises/:id - Soft delete franchise
    this.router.delete(
      API_PATH.FRANCHISE_ID,
      authMiddleware(),
      requireMoreContext(BASE_ROLE_SYSTEM),
      this.controller.softDeleteItem,
    );

    // PATCH domain:/api/franchises/:id/restore - Restore soft deleted franchise
    this.router.patch(
      API_PATH.FRANCHISE_RESTORE,
      authMiddleware(),
      requireMoreContext(BASE_ROLE_SYSTEM),
      this.controller.restoreItem,
    );
  }
}
