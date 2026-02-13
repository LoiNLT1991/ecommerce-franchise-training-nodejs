import { BaseModule } from "../../core/modules";
import { AuditLogModule } from "../audit-log";
import { FranchiseModule } from "../franchise";
import { ProductModule } from "../product";
import ProductFranchiseController from "./product-franchise.controller";
import { IProductFranchiseQuery } from "./product-franchise.interface";
import { ProductFranchiseRepository } from "./product-franchise.repository";
import ProductFranchiseRoute from "./product-franchise.route";
import { ProductFranchiseService } from "./product-franchise.service";

export class ProductFranchiseModule extends BaseModule<ProductFranchiseRoute> {
  private readonly productFranchiseQuery: IProductFranchiseQuery;

  constructor(productModule: ProductModule, franchiseModule: FranchiseModule) {
    super();

    // ===== External dependencies (query only) =====
    const productQuery = productModule.getProductQuery();
    const franchiseQuery = franchiseModule.getFranchiseQuery();

    // ===== Internal dependencies =====
    const auditLogModule = new AuditLogModule();
    const repo = new ProductFranchiseRepository();

    // ===== Core service & HTTP layer =====
    const service = new ProductFranchiseService(repo, auditLogModule.getAuditLogger(), productQuery, franchiseQuery);

    const controller = new ProductFranchiseController(service);
    this.route = new ProductFranchiseRoute(controller);

    this.productFranchiseQuery = service;
  }

    public getProductFranchiseQuery(): IProductFranchiseQuery {
      return this.productFranchiseQuery;
    }
}
