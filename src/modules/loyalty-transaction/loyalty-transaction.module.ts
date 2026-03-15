import { BaseModule } from "../../core";
import { LoyaltyTransactionController } from "./loyalty-transaction.controller";
import { ILoyaltyTransactionLogger } from "./loyalty-transaction.interface";
import { LoyaltyTransactionRepository } from "./loyalty-transaction.repository";
import LoyaltyTransactionRoute from "./loyalty-transaction.route";
import { LoyaltyTransactionService } from "./loyalty-transaction.service";

export class LoyaltyTransactionModule extends BaseModule<LoyaltyTransactionRoute> {
  private readonly loyaltyTransactionLogger: ILoyaltyTransactionLogger;

  constructor() {
    super();

    // Internal dependencies
    const repo = new LoyaltyTransactionRepository();

    // Core service and HTTP layer
    const service = new LoyaltyTransactionService(repo);
    const controller = new LoyaltyTransactionController();
    this.route = new LoyaltyTransactionRoute(controller);

    // Expose ONLY interface
    this.loyaltyTransactionLogger = service;
  }

  public getLoyaltyTransactionLogger(): ILoyaltyTransactionLogger {
    return this.loyaltyTransactionLogger;
  }
}