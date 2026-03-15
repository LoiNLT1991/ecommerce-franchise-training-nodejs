import { OrderModule } from "./../order/order.module";
import { BaseModule } from "../../core";
import { AuditLogModule } from "../audit-log";
import { PaymentController } from "./payment.controller";
import { IPaymentQuery } from "./payment.interface";
import { PaymentRepository } from "./payment.repository";
import PaymentRoute from "./payment.route";
import { PaymentService } from "./payment.service";
import { VoucherModule } from "../voucher";
import { LoyaltyRuleModule } from "../loyalty-rule";
import { CustomerFranchiseModule } from "../customer-franchise";

export class PaymentModule extends BaseModule<PaymentRoute> {
  private readonly paymentQuery: IPaymentQuery;

  constructor(
    orderModule: OrderModule,
    voucherModule: VoucherModule,
    customerFranchiseModule: CustomerFranchiseModule,
  ) {
    super();

    // ===== External dependencies =====
    const orderQuery = orderModule.getOrderQuery();
    const voucherQuery = voucherModule.getVoucherQuery();
    const customerFranchiseQuery = customerFranchiseModule.getCustomerFranchiseQuery();

    // ===== Internal dependencies =====
    const auditLogModule = new AuditLogModule();
    const auditLogger = auditLogModule.getAuditLogger();
    const repo = new PaymentRepository();

    // Core service and Http layer
    const service = new PaymentService(repo, auditLogger, orderQuery, voucherQuery, customerFranchiseQuery);
    const controller = new PaymentController(service);
    this.route = new PaymentRoute(controller);

    this.paymentQuery = service;
  }

  public getPaymentQuery(): IPaymentQuery {
    return this.paymentQuery;
  }
}
