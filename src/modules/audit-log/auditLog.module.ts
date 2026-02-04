import { BaseModule } from "../../core/modules";
import AuditLogController from "./auditLog.controller";
import { IAuditLogger } from "./auditLog.interface";
import { AuditLogRepository } from "./auditLog.repository";
import AuditLogRoute from "./auditLog.route";
import AuditLogService from "./auditLog.service";

export class AuditLogModule extends BaseModule<AuditLogRoute> {
  private readonly repo: AuditLogRepository;
  private readonly auditLogger: IAuditLogger;

  constructor() {
    super();
    this.repo = new AuditLogRepository();

    const service = new AuditLogService(this.repo);
    const controller = new AuditLogController(service);
    
    this.auditLogger = service;

    this.route = new AuditLogRoute(controller);
  }

  public getAuditLogger(): IAuditLogger {
    return this.auditLogger;
  }
}
