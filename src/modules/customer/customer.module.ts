import { BaseModule, MailService } from "../../core";
import { AuditLogModule } from "../audit-log";
import { CustomerController } from "./customer.controller";
import { ICustomerQuery } from "./customer.interface";
import { CustomerRepository } from "./customer.repository";
import CustomerRoute from "./customer.route";
import CustomerService from "./customer.service";

export class CustomerModule extends BaseModule<CustomerRoute> {
  private readonly customerQuery: ICustomerQuery;

  constructor() {
    super();

    // ===== Internal dependencies =====
    const auditLogModule = new AuditLogModule();
    const mailService = new MailService();
    const repo = new CustomerRepository();

    // Core service and Http layer
    const service = new CustomerService(repo, auditLogModule.getAuditLogger(), mailService);
    const controller = new CustomerController(service);
    this.route = new CustomerRoute(controller);

    this.customerQuery = service;
  }

  public getCustomerQuery(): ICustomerQuery {
    return this.customerQuery;
  }
}
