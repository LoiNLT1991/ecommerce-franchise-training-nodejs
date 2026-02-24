import { BaseModule } from "../../core/modules";
import { MailService } from "../../core/services";
import { AuditLogModule } from "../audit-log";
import UserController from "./user.controller";
import { IUserQuery, IUserValidation } from "./user.interface";
import { UserQuery } from "./user.query";
import { UserRepository } from "./user.repository";
import UserRoute from "./user.route";
import UserService from "./user.service";
import { UserValidation } from "./user.validation";

export class UserModule extends BaseModule<UserRoute> {
  private readonly userValidation: UserValidation;
  private readonly userQuery: UserQuery;

  constructor() {
    super();

    // ===== Internal dependencies =====
    const auditLogModule = new AuditLogModule();
    const mailService = new MailService();
    const repo = new UserRepository();
    this.userValidation = new UserValidation(repo);
    this.userQuery = new UserQuery(repo);

    // Core service and Http layer
    const service = new UserService(
      repo,
      auditLogModule.getAuditLogger(),
      this.getUserValidation(),
      this.getUserQuery(),
      mailService,
    );
    const controller = new UserController(service);
    this.route = new UserRoute(controller);
  }

  public getUserQuery(): IUserQuery {
    return this.userQuery;
  }

  public getUserValidation(): IUserValidation {
    return this.userValidation;
  }
}
