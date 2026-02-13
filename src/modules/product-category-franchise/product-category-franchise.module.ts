
import { BaseModule } from "../../core";
import { AuditLogModule } from "../audit-log";
import { CategoryFranchiseModule } from "../category-franchise";
import { FranchiseModule } from "../franchise";
import { ProductFranchiseModule } from "../product-franchise";
import ProductCategoryFranchiseController from "./product-category-franchise.controller";
import { IProductCategoryFranchiseQuery } from "./product-category-franchise.interface";
import { ProductCategoryFranchiseRepository } from "./product-category-franchise.repository";
import ProductCategoryFranchiseRoute from "./product-category-franchise.route";
import { ProductCategoryFranchiseService } from "./product-category-franchise.service";

export class ProductCategoryFranchiseModule extends BaseModule<ProductCategoryFranchiseRoute> {
  private readonly productCategoryFranchiseQuery: IProductCategoryFranchiseQuery;

  constructor(
    franchiseModule: FranchiseModule,
    categoryFranchiseModule: CategoryFranchiseModule,
    productFranchiseModule: ProductFranchiseModule,
  ) {
    super();

    // ===== External dependencies (query only) =====
    const franchiseQuery = franchiseModule.getFranchiseQuery();
    const categoryFranchiseQuery = categoryFranchiseModule.getCategoryFranchiseQuery();
    const productFranchiseQuery = productFranchiseModule.getProductFranchiseQuery();

    // ===== Internal dependencies =====
    const auditLogModule = new AuditLogModule();
    const auditLogQuery = auditLogModule.getAuditLogger();
    const repo = new ProductCategoryFranchiseRepository();

    // ===== Core service & HTTP layer =====
    const service = new ProductCategoryFranchiseService(repo, auditLogQuery, franchiseQuery, categoryFranchiseQuery, productFranchiseQuery);

    const controller = new ProductCategoryFranchiseController(service);
    this.route = new ProductCategoryFranchiseRoute(controller);

    this.productCategoryFranchiseQuery = service;
  }

  public getProductCategoryFranchiseQuery(): IProductCategoryFranchiseQuery {
    return this.productCategoryFranchiseQuery;
  }
}
