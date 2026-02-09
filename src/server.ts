import dotenv from "dotenv";
import App from "./app";
import { validateEnv } from "./core/utils";
import { AuditLogModule } from "./modules/audit-log";
import { AuthModule } from "./modules/auth";
import { FranchiseModule } from "./modules/franchise";
import { IndexModule } from "./modules/index";
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

const routes = [
  indexModule.getRoute(),
  auditLogModule.getRoute(),
  authModule.getRoute(),
  franchiseModule.getRoute(),
  roleModule.getRoute(),
  userModule.getRoute(),
  userFranchiseRoleModule.getRoute(),
];
const app = new App(routes);

app.listen();
