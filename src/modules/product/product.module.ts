import { BaseModule } from "../../core/modules";
import { AuditLogModule } from "../audit-log";
import { ProductController } from "./product.controller";
import { ProductRepository } from "./product.repository";
import ProductRoute from "./product.route";
import { ProductService } from "./product.service";

export class ProductModule extends BaseModule<ProductRoute> {
  constructor() {
    super();

    // Internal dependencies
    const auditLogModule = new AuditLogModule();
    const repo = new ProductRepository();

    // Core service and HTTP layer
    const service = new ProductService(repo, auditLogModule.getAuditLogger());
    const controller = new ProductController(service);
    this.route = new ProductRoute(controller);
  }
}
