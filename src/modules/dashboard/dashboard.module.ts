import { BaseModule } from "../../core";
import { CustomerModule } from "../customer";
import { CustomerFranchiseModule } from "../customer-franchise";
import { DeliveryModule } from "../delivery";
import { OrderModule } from "../order";
import { PaymentModule } from "../payment";
import { ProductModule } from "../product";
import { ProductCategoryFranchiseModule } from "../product-category-franchise";
import { UserModule } from "../user";
import { UserFranchiseRoleModule } from "../user-franchise-role";
import { DashboardController } from "./dashboard.controller";
import DashboardRoute from "./dashboard.route";
import { DashboardService } from "./dashboard.service";

export class DashboardModule extends BaseModule<DashboardRoute> {
  constructor(
    userModule: UserModule,
    userFranchiseRoleModule: UserFranchiseRoleModule,
    customerModule: CustomerModule,
    customerFranchiseModule: CustomerFranchiseModule,
    productModule: ProductModule,
    productCategoryFranchiseModule: ProductCategoryFranchiseModule,
    orderModule: OrderModule,
    paymentModule: PaymentModule,
    deliveryModule: DeliveryModule,
  ) {
    super();

    // ===== External dependencies =====
    const userQuery = userModule.getUserQuery();
    const userFranchiseRoleQuery = userFranchiseRoleModule.getUserFranchiseRoleQuery();
    const customerQuery = customerModule.getCustomerQuery();
    const customerFranchiseQuery = customerFranchiseModule.getCustomerFranchiseQuery();
    const productQuery = productModule.getProductQuery();
    const productCategoryFranchiseQuery = productCategoryFranchiseModule.getProductCategoryFranchiseQuery();
    const orderQuery = orderModule.getOrderQuery();
    const paymentQuery = paymentModule.getPaymentQuery();
    const deliveryQuery = deliveryModule.getDeliveryQuery();

    // ===== Internal dependencies =====

    // Core service and Http layer
    const service = new DashboardService(
      userQuery,
      userFranchiseRoleQuery,
      customerQuery,
      customerFranchiseQuery,
      productQuery,
      productCategoryFranchiseQuery,
      orderQuery,
      paymentQuery,
      deliveryQuery,
    );
    const controller = new DashboardController(service);
    this.route = new DashboardRoute(controller);
  }
}
