import { BaseModule } from "../../core/modules";
import AuditLogController from "./auditLog.controller";
import { IAuditLogger } from "./auditLog.interface";
import { AuditLogRepository } from "./auditLog.repository";
import AuditLogRoute from "./auditLog.route";
import AuditLogService from "./auditLog.service";

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
