import { BaseModule } from "../../core";
import { AuditLogModule } from "../audit-log";
import { RefundController } from "./refund.controller";
import { IRefundQuery } from "./refund.interface";
import { RefundRepository } from "./refund.repository";
import RefundRoute from "./refund.route";
import { RefundService } from "./refund.service";

export class RefundModule extends BaseModule<RefundRoute> {
  private readonly refundQuery: IRefundQuery;

  constructor() {
    super();

    // ===== External dependencies =====

    // ===== Internal dependencies =====
    const auditLogModule = new AuditLogModule();
    const auditLogger = auditLogModule.getAuditLogger();
    const repo = new RefundRepository();

    // Core service and Http layer
    const service = new RefundService(repo, auditLogger);
    const controller = new RefundController();
    this.route = new RefundRoute(controller);

    this.refundQuery = service;
  }

  public getRefundQuery(): IRefundQuery {
    return this.refundQuery;
  }
}
