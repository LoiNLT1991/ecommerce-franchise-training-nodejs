import dotenv from "dotenv";
import App from "./app";
import { validateEnv } from "./core/utils";
import { AuditLogModule } from "./modules/audit-log";
import { AuthModule } from "./modules/auth";
import { FranchiseModule } from "./modules/franchise";
import { IndexModule } from "./modules/index";
import { UserModule } from "./modules/user";

dotenv.config();
validateEnv();

const indexModule = new IndexModule();
const auditLogModule = new AuditLogModule();
const authModule = new AuthModule();
const franchiseModule = new FranchiseModule();
const userModule = new UserModule();

const routes = [
  indexModule.getRoute(),
  auditLogModule.getRoute(),
  authModule.getRoute(),
  franchiseModule.getRoute(),
  userModule.getRoute(),
];
const app = new App(routes);

app.listen();
