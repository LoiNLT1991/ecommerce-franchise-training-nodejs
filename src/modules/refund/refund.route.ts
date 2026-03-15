import { Router } from "express";
import { API_PATH, IRoute } from "../../core";
import { RefundController } from "./refund.controller";

export default class RefundRoute implements IRoute {
  public path = API_PATH.REFUND;
  public router = Router();

  constructor(private readonly controller: RefundController) {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    /**
     * @swagger
     * tags:
     *   - name: Refund
     *     description: Delivery related endpoints
     */
  }
}
