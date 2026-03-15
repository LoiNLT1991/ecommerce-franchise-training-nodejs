import { BaseModule } from "../../core";
import { OrderStatusLogController } from "./order-status-log.controller";
import { IOrderStatusLogger } from "./order-status-log.interface";
import { OrderStatusLogRepository } from "./order-status-log.repository";
import OrderStatusLogRoute from "./order-status-log.route";
import { OrderStatusLogService } from "./order-status-log.service";

export class OrderStatusLogModule extends BaseModule<OrderStatusLogRoute> {
  private readonly orderStatusLogger: IOrderStatusLogger;

  constructor() {
    super();

    // Internal dependencies
    const repo = new OrderStatusLogRepository();

    // Core service and HTTP layer
    const service = new OrderStatusLogService(repo);
    const controller = new OrderStatusLogController();
    this.route = new OrderStatusLogRoute(controller);

    // Expose ONLY interface
    this.orderStatusLogger = service;
  }

  public getOrderStatusLogger(): IOrderStatusLogger {
    return this.orderStatusLogger;
  }
}
