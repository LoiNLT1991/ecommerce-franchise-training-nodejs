import { ClientSession } from "mongoose";
import { IOrderStatusLogger, IOrderStatusLogPayload } from "./order-status-log.interface";
import { OrderStatusLogRepository } from "./order-status-log.repository";

export class OrderStatusLogService implements IOrderStatusLogger {
  constructor(private readonly repo: OrderStatusLogRepository) {}

  public async logOrderStatus(payload: IOrderStatusLogPayload, session?: ClientSession): Promise<void> {
    const logData = {
      order_id: payload.order_id,
      old_status: payload.old_status,
      new_status: payload.new_status,
      changed_by_staff: payload.changed_by_staff,
      changed_by_customer: payload.changed_by_customer,
      note: payload.note,
    };
    await this.repo.create(logData, session);
  }
}
