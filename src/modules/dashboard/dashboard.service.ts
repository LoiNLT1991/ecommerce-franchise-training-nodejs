import { Types } from "mongoose";
import { ICustomerQuery } from "../customer";
import { ICustomerFranchiseQuery } from "../customer-franchise";
import { IDeliveryQuery } from "../delivery";
import { IOrderQuery } from "../order";
import { IPaymentQuery } from "../payment";
import { IProductQuery } from "../product";
import { IProductCategoryFranchiseQuery } from "../product-category-franchise";
import { IUserQuery } from "../user";
import { IUserFranchiseRoleQuery } from "../user-franchise-role";

export class DashboardService {
  constructor(
    private readonly userQuery: IUserQuery,
    private readonly userFranchiseRoleQuery: IUserFranchiseRoleQuery,
    private readonly customerQuery: ICustomerQuery,
    private readonly customerFranchiseQuery: ICustomerFranchiseQuery,
    private readonly productQuery: IProductQuery,
    private readonly productCategoryFranchiseQuery: IProductCategoryFranchiseQuery,
    private readonly orderQuery: IOrderQuery,
    private readonly paymentQuery: IPaymentQuery,
    private readonly deliveryQuery: IDeliveryQuery,
  ) {}

  public async getDashboardInfo(franchiseId?: string) {
    let id: Types.ObjectId | undefined;

    if (franchiseId && Types.ObjectId.isValid(franchiseId)) {
      id = new Types.ObjectId(franchiseId);
    }

    const [
      countUsers,
      countUserFranchises,
      countCustomers,
      countCustomerFranchises,
      countProducts,
      countProductFranchises,
      countOrders,
      countPayments,
      countDeliveries,
    ] = await Promise.all([
      this.countUsers(),
      this.countUserFranchises(id),
      this.countCustomers(),
      this.countCustomerFranchises(id),
      this.countProducts(),
      this.countProductFranchises(id),
      this.countOrders(id),
      this.countPayments(id),
      this.countDeliveries(id),
    ]);

    return {
      countUsers,
      countUserFranchises,
      countCustomers,
      countCustomerFranchises,
      countProducts,
      countProductFranchises,
      countOrders,
      countPayments,
      countDeliveries,
    };
  }

  private async countUsers(): Promise<number> {
    return this.userQuery.countItems();
  }

  private async countUserFranchises(franchiseId?: Types.ObjectId): Promise<number> {
    return this.userFranchiseRoleQuery.countUserFranchises(franchiseId);
  }

  private async countCustomers(): Promise<number> {
    return this.customerQuery.countCustomers();
  }

  private async countCustomerFranchises(franchiseId?: Types.ObjectId): Promise<number> {
    return this.customerFranchiseQuery.countCustomerFranchises(franchiseId);
  }

  private async countProducts(): Promise<number> {
    return this.productQuery.countItems();
  }

  private async countProductFranchises(franchiseId?: Types.ObjectId): Promise<number> {
    return this.productCategoryFranchiseQuery.countItems(franchiseId);
  }

  private async countOrders(franchiseId?: Types.ObjectId): Promise<Record<string, number>> {
    return this.orderQuery.countItems(franchiseId);
  }
  private async countPayments(franchiseId?: Types.ObjectId): Promise<Record<string, number>> {
    return this.paymentQuery.countItems(franchiseId);
  }
  private async countDeliveries(franchiseId?: Types.ObjectId): Promise<Record<string, number>> {
    return this.deliveryQuery.countItems(franchiseId);
  }
}
