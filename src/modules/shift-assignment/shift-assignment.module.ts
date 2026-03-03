import { BaseModule } from "../../core";
import { AuditLogModule } from "../audit-log";
import { ShiftAssignmentController } from "./shift-assignment.controller";
import { ShiftAssignmentRepository } from "./shift-assignment.repository";
import ShiftAssignmentRoute from "./shift-assignment.route";
import { ShiftAssignmentService } from "./shift-assignment.service";

export class ShiftAssignmentModule extends BaseModule<ShiftAssignmentRoute> {
  constructor() {
    super();

    // ===== Internal dependencies =====
    const auditLogModule = new AuditLogModule();
    const repo = new ShiftAssignmentRepository();

    // Core service and Http layer
    const service = new ShiftAssignmentService(repo, auditLogModule.getAuditLogger());
    const controller = new ShiftAssignmentController(service);
    this.route = new ShiftAssignmentRoute(controller);
    console.log("DEBUG: ShiftAssignmentModule initialized");
  }
}

