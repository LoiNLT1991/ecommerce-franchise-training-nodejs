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

dotenv.config();
validateEnv();

const indexModule = new IndexModule();
const auditLogModule = new AuditLogModule();
const authModule = new AuthModule();
const franchiseModule = new FranchiseModule();
const roleModule = new RoleModule();
const userModule = new UserModule();
const userFranchiseRoleModule = new UserFranchiseRoleModule();
const categoryModule = new CategoryModule();
const productModule = new ProductModule();

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
];
const app = new App(routes);

app.listen();
