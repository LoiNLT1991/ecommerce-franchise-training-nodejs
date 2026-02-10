import dotenv from "dotenv";
import App from "./app";
import { validateEnv } from "./core/utils";
import { AuditLogModule } from "./modules/audit-log";
import { AuthModule } from "./modules/auth";
import { CategoryModule } from "./modules/category";
import { FranchiseModule } from "./modules/franchise";
import { IndexModule } from "./modules/index";
import { ProductModule } from "./modules/product";
import { RoleModule } from "./modules/role";
import { UserModule } from "./modules/user";
import { UserFranchiseRoleModule } from "./modules/user-franchise-role";
import { CategoryFranchiseModule } from "./modules/category-franchise/category-franchise.module";
import { ProductFranchiseModule } from "./modules/product-franchise";

dotenv.config();
validateEnv();

// ===== Core / infra =====
const indexModule = new IndexModule();
const auditLogModule = new AuditLogModule();

// ===== Domain modules (singleton) =====
const franchiseModule = new FranchiseModule();
const userModule = new UserModule();
const roleModule = new RoleModule();
const categoryModule = new CategoryModule();
const productModule = new ProductModule();

// ===== Dependent modules =====
const userFranchiseRoleModule = new UserFranchiseRoleModule(userModule, roleModule, franchiseModule);
const authModule = new AuthModule(userFranchiseRoleModule, userModule);
const categoryFranchiseModule = new CategoryFranchiseModule(categoryModule, franchiseModule);
const productFranchiseModule = new ProductFranchiseModule(productModule, franchiseModule);

// ===== Register routes =====
const routes = [
  indexModule.getRoute(),
  auditLogModule.getRoute(),
  authModule.getRoute(),
  franchiseModule.getRoute(),
  roleModule.getRoute(),
  userModule.getRoute(),
  userFranchiseRoleModule.getRoute(),
  categoryModule.getRoute(),
  productModule.getRoute(),
  categoryFranchiseModule.getRoute(),
  productFranchiseModule.getRoute(),
];

const app = new App(routes);
app.listen();
