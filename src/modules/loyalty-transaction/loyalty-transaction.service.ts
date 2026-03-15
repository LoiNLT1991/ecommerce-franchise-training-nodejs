import { ClientSession } from "mongoose";
import { ILoyaltyTransaction, ILoyaltyTransactionLogger, ILoyaltyTransactionPayload } from "./loyalty-transaction.interface";
import { LoyaltyTransactionRepository } from "./loyalty-transaction.repository";

export class LoyaltyTransactionService implements ILoyaltyTransactionLogger {
  constructor(private readonly repo: LoyaltyTransactionRepository) {}

  public async logLoyaltyTransaction(payload: ILoyaltyTransactionPayload, session?: ClientSession): Promise<void> {
    const logData = {
      customer_franchise_id: payload.customer_franchise_id,
      order_id: payload.order_id,
      point_change: payload.point_change,
      type: payload.type,
      reason: payload.reason,
      changed_by_staff: payload.changed_by_staff,
      changed_by_customer: payload.changed_by_customer,
    };
    await this.repo.create(logData, session);
  }

  public async findEarnByOrderId(orderId: string, session?: ClientSession): Promise<ILoyaltyTransaction | null> {
    return this.repo.findEarnByOrderId(orderId, session);
  }
}
