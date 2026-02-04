import { BaseModule } from "../../core/modules";
import { AuditLogModule } from "../audit-log";
import FranchiseController from "./franchise.controller";
import { FranchiseRepository } from "./franchise.repository";
import FranchiseRoute from "./franchise.route";
import FranchiseService from "./franchise.service";

export class FranchiseModule extends BaseModule<FranchiseRoute> {
  private readonly repo: FranchiseRepository;

  constructor() {
    super();
    this.repo = new FranchiseRepository();

    const auditLogModule = new AuditLogModule();

    const franchiseService = new FranchiseService(this.repo, auditLogModule.getAuditLogger());
    const franchiseController = new FranchiseController(franchiseService);

    this.route = new FranchiseRoute(franchiseController);
  }
}
