import { BaseModule } from "../../core/modules";
import { AuditLogModule } from "../audit-log";
import { CategoryController } from "./category.controller";
import { CategoryRepository } from "./category.repository";
import CategoryRoute from "./category.route";
import { CategoryService } from "./category.service";

export class CategoryModule extends BaseModule<CategoryRoute> {
  constructor() {
    super();

    // Internal dependencies
    const auditLogModule = new AuditLogModule();
    const repo = new CategoryRepository();

    // Core service and HTTP layer
    const service = new CategoryService(repo, auditLogModule.getAuditLogger());
    const controller = new CategoryController(service);
    this.route = new CategoryRoute(controller);
  }
}
