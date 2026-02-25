import { BaseModule, MailService } from "../../core";
import { CustomerModule } from "../customer";
import CustomerAuthController from "./customer-auth.controller";
import CustomerAuthRoute from "./customer-auth.route";
import { CustomerAuthService } from "./customer-auth.service";

export class CustomerAuthModule extends BaseModule<CustomerAuthRoute> {
  constructor(customerModule: CustomerModule) {
    super();

    // ===== External domain dependencies =====
    const customerQuery = customerModule.getCustomerQuery();

    // ===== Internal dependencies =====
    const mailService = new MailService();

    // Core service and Http layer
    const service = new CustomerAuthService(mailService, customerQuery);
    const controller = new CustomerAuthController(service);
    this.route = new CustomerAuthRoute(controller);

  }
}
