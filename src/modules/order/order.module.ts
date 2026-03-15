import { BaseModule } from "../../core";
import { AuditLogModule } from "../audit-log";
import { CustomerFranchiseModule } from "../customer-franchise";
import { OrderItemModule } from "../order-item";
import { OrderStatusLogModule } from "../order-status-log";
import { PaymentModule } from "../payment";
import { OrderController } from "./order.controller";
import { IOrderQuery } from "./order.interface";
import { OrderRepository } from "./order.repository";
import OrderRoute from "./order.route";
import { OrderService } from "./order.service";

export class OrderModule extends BaseModule<OrderRoute> {
  private readonly orderQuery: IOrderQuery;

  constructor(
    orderStatusLogModule: OrderStatusLogModule,
    orderItemModule: OrderItemModule,
    customerFranchiseModule: CustomerFranchiseModule,
  ) {
    super();

    // ===== External dependencies =====
    const orderStatusLogger = orderStatusLogModule.getOrderStatusLogger();
    const orderItemQuery = orderItemModule.getOrderItemQuery();
    const customerFranchiseQuery = customerFranchiseModule.getCustomerFranchiseQuery();

    // ===== Internal dependencies =====
    const auditLogModule = new AuditLogModule();
    const auditLogger = auditLogModule.getAuditLogger();
    const repo = new OrderRepository();

    // Core service and Http layer
    const service = new OrderService(
      repo,
      auditLogger,
      orderStatusLogger,
      orderItemQuery,
      customerFranchiseQuery,
    );
    const controller = new OrderController(service);
    this.route = new OrderRoute(controller);

    this.orderQuery = service;
  }

  public getOrderQuery(): IOrderQuery {
    return this.orderQuery;
  }
}
