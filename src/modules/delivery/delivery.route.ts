import { Router } from "express";
import { API_PATH, IRoute } from "../../core";
import { DeliveryController } from "./delivery.controller";

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
  }
}
