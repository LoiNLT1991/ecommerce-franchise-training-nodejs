import { Router } from "express";
import {
  API_PATH,
  authMiddleware,
  IRoute,
  requireMoreContext,
  SYSTEM_AND_FRANCHISE_ALL_ROLES,
  validationMiddleware,
} from "../../core";
import CustomerFranchiseController from "./customer-franchise.controller";
import { SearchPaginationItemDto } from "./dto/search.dto";

export default class CustomerFranchiseRoute implements IRoute {
  public path = API_PATH.CUSTOMER_FRANCHISE;
  public router = Router();

  constructor(private readonly controller: CustomerFranchiseController) {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    /**
     * @swagger
     * tags:
     *   - name: CustomerFranchise
     *     description: CustomerFranchise related endpoints
     */

    // GET domain:/api/customer-franchises/:id - Get item by id
    this.router.get(
      API_PATH.CUSTOMER_FRANCHISE_ID,
      authMiddleware(),
      requireMoreContext(SYSTEM_AND_FRANCHISE_ALL_ROLES),
      this.controller.getItem,
    );

    // POST domain:/api/customer-franchises/search - Search items with pagination
    this.router.post(
      API_PATH.CUSTOMER_FRANCHISE_SEARCH,
      authMiddleware(),
      requireMoreContext(SYSTEM_AND_FRANCHISE_ALL_ROLES),
      validationMiddleware(SearchPaginationItemDto, true, { enableImplicitConversion: false }),
      this.controller.getItems,
    );
  }
}
