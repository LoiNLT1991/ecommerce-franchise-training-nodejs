import { BaseModule } from "../../core/modules";
import { MailService } from "../../core/services";
import { UserModule } from "../user";
import { UserFranchiseRoleModule } from "../user-franchise-role";
import AuthController from "./auth.controller";
import AuthRoute from "./auth.route";
import AuthService from "./auth.service";

export class AuthModule extends BaseModule<AuthRoute> {
  constructor() {
    super();

    // Internal dependencies
    const userModule = new UserModule();
    const userFranchiseRoleModule = new UserFranchiseRoleModule();
    const mailService = new MailService();

    // Core service and HTTP layer
    const service = new AuthService(
      userFranchiseRoleModule.getUserContext(),
      userModule.getUserValidation(),
      userModule.getUserQuery(),
      mailService,
    );
    const controller = new AuthController(service);
    this.route = new AuthRoute(controller);
  }
}
