import { Router } from "express";
import { API_PATH, IRoute } from "../../core";
import { OrderItemController } from "./order-item.controller";

export default class OrderItemRoute implements IRoute {
  public path = API_PATH.CART_ITEM;
  public router = Router();

  constructor(private readonly controller: OrderItemController) {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    /**
     * @swagger
     * tags:
     *   - name: OrderItem
     *     description: OrderItem related endpoints
     */
  }
}
