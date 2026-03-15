import { Router } from "express";
import { API_PATH, IRoute } from "../../core";
import { LoyaltyTransactionController } from "./loyalty-transaction.controller";

export default class LoyaltyTransactionRoute implements IRoute {
  public path = API_PATH.LOYALTY_TRANSACTION;
  public router = Router();

  constructor(private readonly controller: LoyaltyTransactionController) {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    /**
     * @swagger
     * tags:
     *   - name: LoyaltyTransaction
     *     description: LoyaltyTransaction related endpoints
     */
  }
}
