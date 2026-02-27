import { BaseModule } from "../../core";
import { AuditLogModule } from "../audit-log";
import { CategoryFranchiseModule } from "../category-franchise";
import { FranchiseModule } from "../franchise";
import { ProductFranchiseModule } from "../product-franchise";
import { ClientController } from "./client.controller";
import ClientRoute from "./client.route";
import { ClientService } from "./client.service";

export class ClientModule extends BaseModule<ClientRoute> {
  constructor(
    franchiseModule: FranchiseModule,
    categoryFranchiseModule: CategoryFranchiseModule,
    productFranchiseModule: ProductFranchiseModule,
  ) {
    super();

    // External dependencies
    const franchiseQuery = franchiseModule.getFranchiseQuery();
    const categoryFranchiseQuery = categoryFranchiseModule.getCategoryFranchiseQuery();
    const productFranchiseQuery = productFranchiseModule.getProductFranchiseQuery();

    // Internal dependencies
    const auditLogModule = new AuditLogModule();
    const auditLogger = auditLogModule.getAuditLogger();

    // Core service and HTTP layer
    const service = new ClientService(auditLogger, franchiseQuery, categoryFranchiseQuery, productFranchiseQuery);
    const controller = new ClientController(service);
    this.route = new ClientRoute(controller);
  }
}
