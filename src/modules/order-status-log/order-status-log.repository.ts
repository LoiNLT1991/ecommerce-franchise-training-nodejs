import { BaseRepository } from "../../core";
import { IOrderStatusLog } from "./order-status-log.interface";
import OrderStatusLogSchema from "./order-status-log.model";

export class OrderStatusLogRepository extends BaseRepository<IOrderStatusLog> {
  constructor() {
    super(OrderStatusLogSchema);
  }
}