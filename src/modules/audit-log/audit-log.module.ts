import { BaseModule } from "../../core/modules";
import AuditLogController from "./audit-log.controller";
import { IAuditLogger } from "./audit-log.interface";
import { AuditLogRepository } from "./audit-log.repository";
import AuditLogRoute from "./audit-log.route";
import AuditLogService from "./audit-log.service";

export class AuditLogModule extends BaseModule<AuditLogRoute> {
  private readonly auditLogger: IAuditLogger;

  constructor() {
    super();

    // Internal dependencies
    const repo = new AuditLogRepository();

    // Core service and HTTP layer
    const service = new AuditLogService(repo);
    const controller = new AuditLogController(service);
    this.route = new AuditLogRoute(controller);

    // Expose ONLY interface
    this.auditLogger = service;
  }

  public getAuditLogger(): IAuditLogger {
    return this.auditLogger;
  }
}
