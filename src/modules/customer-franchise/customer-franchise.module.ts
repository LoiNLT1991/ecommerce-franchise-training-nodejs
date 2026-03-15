import { BaseModule } from "../../core";
import { AuditLogModule } from "../audit-log";
import { CustomerModule } from "../customer";
import { FranchiseModule } from "../franchise";
import { LoyaltyRuleModule } from "../loyalty-rule";
import { LoyaltyTransactionModule } from "../loyalty-transaction";
import CustomerFranchiseController from "./customer-franchise.controller";
import { ICustomerFranchiseQuery } from "./customer-franchise.interface";
import { CustomerFranchiseRepository } from "./customer-franchise.repository";
import CustomerFranchiseRoute from "./customer-franchise.route";
import CustomerFranchiseService from "./customer-franchise.service";

export class CustomerFranchiseModule extends BaseModule<CustomerFranchiseRoute> {
  private readonly customerFranchiseQuery: ICustomerFranchiseQuery;

  constructor(
    franchiseModule: FranchiseModule,
    customerModule: CustomerModule,
    loyaltyRuleModule: LoyaltyRuleModule,
    loyaltyTransactionModule: LoyaltyTransactionModule,
  ) {
    super();

    // ===== External domain dependencies =====
    const franchiseQuery = franchiseModule.getFranchiseQuery();
    const customerQuery = customerModule.getCustomerQuery();
    const loyaltyRuleQuery = loyaltyRuleModule.getLoyaltyRuleQuery();
    const loyaltyTransactionLogger = loyaltyTransactionModule.getLoyaltyTransactionLogger();

    // ===== Internal dependencies =====
    const auditLogModule = new AuditLogModule();
    const auditLogger = auditLogModule.getAuditLogger();
    const repo = new CustomerFranchiseRepository();

    // ===== Core service =====
    const service = new CustomerFranchiseService(
      repo,
      auditLogger,
      franchiseQuery,
      customerQuery,
      loyaltyRuleQuery,
      loyaltyTransactionLogger,
    );

    // ===== HTTP layer =====
    const controller = new CustomerFranchiseController(service);
    this.route = new CustomerFranchiseRoute(controller);

    // ===== Expose ONLY interface =====
    this.customerFranchiseQuery = service;
  }

  public getCustomerFranchiseQuery(): ICustomerFranchiseQuery {
    return this.customerFranchiseQuery;
  }
}
