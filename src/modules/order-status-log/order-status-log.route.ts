import { Router } from "express";
import { API_PATH, IRoute } from "../../core";
import { OrderStatusLogController } from "./order-status-log.controller";

export default class OrderStatusLogRoute implements IRoute {
  public path = API_PATH.ORDER_STATUS_LOG;
  public router = Router();

  constructor(private readonly controller: OrderStatusLogController) {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    /**
     * @swagger
     * tags:
     *   - name: OrderStatusLog
     *     description: OrderStatusLog related endpoints
     */
  }
}