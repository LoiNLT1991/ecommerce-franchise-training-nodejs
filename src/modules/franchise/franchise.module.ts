import { BaseModule } from "../../core/modules";
import { AuditLogModule } from "../audit-log";
import FranchiseController from "./franchise.controller";
import { IFranchiseQuery } from "./franchise.interface";
import { FranchiseRepository } from "./franchise.repository";
import FranchiseRoute from "./franchise.route";
import FranchiseService from "./franchise.service";

export class FranchiseModule extends BaseModule<FranchiseRoute> {
  private readonly franchiseQuery: IFranchiseQuery;

  constructor() {
    super();

    // Internal dependencies
    const auditLogModule = new AuditLogModule();
    const repo = new FranchiseRepository();

    // Core service and HTTP layer
    const service = new FranchiseService(repo, auditLogModule.getAuditLogger());
    const controller = new FranchiseController(service);
    this.route = new FranchiseRoute(controller);

    // Expose ONLY interface
    this.franchiseQuery = service;
  }

  public getFranchiseQuery(): IFranchiseQuery {
    return this.franchiseQuery;
  }
}
