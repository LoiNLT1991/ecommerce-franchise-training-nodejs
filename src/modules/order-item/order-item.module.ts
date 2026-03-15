import { BaseModule } from "../../core";
import { AuditLogModule } from "../audit-log";
import { OrderItemController } from "./order-item.controller";
import { IOrderItemQuery } from "./order-item.interface";
import { OrderItemRepository } from "./order-item.repository";
import OrderItemRoute from "./order-item.route";
import { OrderItemService } from "./order-item.service";

export class OrderItemModule extends BaseModule<OrderItemRoute> {
  private readonly orderItemQuery: IOrderItemQuery;

  constructor() {
    super();

    // ===== Internal dependencies =====
    const auditLogModule = new AuditLogModule();
    const auditLogger = auditLogModule.getAuditLogger();
    const repo = new OrderItemRepository();

    // Core service and Http layer
    const service = new OrderItemService(repo, auditLogger);
    const controller = new OrderItemController();
    this.route = new OrderItemRoute(controller);

    this.orderItemQuery = service;
  }

  public getOrderItemQuery(): IOrderItemQuery {
    return this.orderItemQuery;
  }
}
