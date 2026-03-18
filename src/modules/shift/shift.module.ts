import { BaseModule } from "../../core";
import { AuditLogModule } from "../audit-log";
import { IShiftAssignmentQuery } from "../shift-assignment";
import { ShiftAssignmentModule } from "./../shift-assignment/shift-assignment.module";
import { ShiftController } from "./shift.controller";
import { IShiftQuery } from "./shift.interface";
import { ShiftRepository } from "./shift.repository";
import ShiftRoute from "./shift.route";
import { ShiftService } from "./shift.service";

export class ShiftModule extends BaseModule<ShiftRoute> {
  private readonly shiftQuery: IShiftQuery;
  private shiftAssignmentQuery!: IShiftAssignmentQuery;
  private readonly shiftService: ShiftService;

  constructor() {
    super();

    const auditLogModule = new AuditLogModule();
    const repo = new ShiftRepository();

    this.shiftService = new ShiftService(repo, auditLogModule.getAuditLogger());

    const controller = new ShiftController(this.shiftService);
    this.route = new ShiftRoute(controller);

    this.shiftQuery = this.shiftService;
  }

  public getShiftQuery(): IShiftQuery {
    return this.shiftQuery;
  }
}
