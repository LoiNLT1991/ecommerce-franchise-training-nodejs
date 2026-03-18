import { Router } from "express";
import { adminAuthMiddleware, API_PATH, IRoute, validationMiddleware } from "../../core";
import { DeliveryController } from "./delivery.controller";
import { validate } from "class-validator";
import { SearchItemDto } from "./dto/search.dto";

export default class DeliveryRoute implements IRoute {
  public path = API_PATH.DELIVERY;
  public router = Router();

  constructor(private readonly controller: DeliveryController) {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    /**
     * @swagger
     * tags:
     *   - name: Delivery
     *     description: Delivery related endpoints
     */

    // GET domain:/api/deliveries/order/:orderId - Get item detail by order
    this.router.get(API_PATH.GET_DELIVERY_BY_ORDER, adminAuthMiddleware(), this.controller.getItemByOrderId);

    // POST domain:/api/deliveries/search - Get items by staffId, customerId, franchiseId, status
    this.router.post(
      API_PATH.SEARCH_DELIVERIES,
      adminAuthMiddleware(),
      validationMiddleware(SearchItemDto),
      this.controller.searchDeliveries,
    );

    // GET domain:/api/deliveries/:id - Get item detail
    this.router.get(API_PATH.DELIVERY_ID, adminAuthMiddleware(), this.controller.getItemDetail);
  }
}
