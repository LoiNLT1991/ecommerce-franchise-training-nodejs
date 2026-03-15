import mongoose, { ClientSession, Types } from "mongoose";
import {
  BaseFieldName,
  CustomerAuthPayload,
  genOrderCode,
  HttpException,
  HttpStatus,
  OrderStatus,
  OrderType,
  UserAuthPayload,
  UserType,
} from "../../core";
import { IAuditLogger } from "../audit-log";
import { ICart } from "../cart";
import { ICustomerFranchiseQuery } from "../customer-franchise";
import { IOrderItemQuery } from "../order-item";
import { IOrderStatusLogger } from "../order-status-log";
import { IPaymentQuery } from "../payment";
import { IOrder, IOrderQuery } from "./order.interface";
import { OrderRepository } from "./order.repository";

export class OrderService implements IOrderQuery {
  private readonly orderRepository: OrderRepository;

  constructor(
    repo: OrderRepository,
    private readonly auditLogger: IAuditLogger,
    private readonly orderStatusLogger: IOrderStatusLogger,
    private readonly orderItemQuery: IOrderItemQuery,
    private readonly customerFranchiseQuery: ICustomerFranchiseQuery,
  ) {
    this.orderRepository = repo;
  }

  public async createOrder(
    cart: ICart,
    loggedUser: UserAuthPayload | CustomerAuthPayload,
    session?: ClientSession,
  ): Promise<IOrder> {
    const { customer_id, franchise_id } = cart;

    // 0: Check orderType
    const orderType = loggedUser.context ? OrderType.POS : OrderType.ONLINE;

    // 1: Check customer franchise
    let customerFranchise = await this.customerFranchiseQuery.findByCustomerAndFranchise(
      customer_id,
      franchise_id,
      session,
    );

    if (!customerFranchise) {
      customerFranchise = await this.customerFranchiseQuery.createCustomerFranchise(
        { customer_id, franchise_id },
        loggedUser.id,
        session,
      );
    }

    // 2: Check unique code
    let code = genOrderCode();
    while (await this.orderRepository.existsByField(BaseFieldName.CODE, code)) {
      code = genOrderCode();
    }

    // 3: Create order
    const order = await this.orderRepository.create(
      {
        cart_id: cart._id,
        customer_id: cart.customer_id,
        franchise_id: cart.franchise_id,
        staff_id: cart.staff_id,

        type: orderType,
        code,

        address: cart.address,
        phone: cart.phone,
        message: cart.message,

        promotion_discount: cart.promotion_discount,
        voucher_discount: cart.voucher_discount,
        loyalty_discount: cart.loyalty_discount,

        subtotal_amount: cart.subtotal_amount,
        final_amount: cart.final_amount,

        promotion_id: cart.promotion_id,
        promotion_type: cart.promotion_type,
        promotion_value: cart.promotion_value,

        voucher_code: cart.voucher_code,
        voucher_type: cart.voucher_type,
        voucher_value: cart.voucher_value,

        loyalty_points_used: cart.loyalty_points_used,

        draft_at: new Date(),
        created_by: new Types.ObjectId(loggedUser.id),
      },
      session,
    );

    // 4: Create order items
    const orderItems = cart.cart_items.map((item) => ({
      order_id: order._id,
      product_franchise_id: item.product_franchise_id,
      quantity: item.quantity,
      price_snapshot: item.product_cart_price,
      note: item.note,
      options_hash: item.options_hash,
      options: item.options,
      discount_amount: item.discount_amount,
      line_total: item.line_total,
      final_line_total: item.final_line_total,
    }));
    await this.orderItemQuery.createOrderItems(orderItems, session);

    // 5: Order Status Log
    await this.orderStatusLogger.logOrderStatus(
      {
        order_id: order._id,
        old_status: OrderStatus.DEFAULT,
        new_status: OrderStatus.DRAFT,
        changed_by_staff: loggedUser.type === UserType.USER ? new Types.ObjectId(loggedUser.id) : undefined,
        changed_by_customer: loggedUser.type === UserType.CUSTOMER ? new Types.ObjectId(loggedUser.id) : undefined,
      },
      session,
    );

    return order;
  }

  public async getOrderDetail(orderId: string) {
    const item = await this.orderRepository.getOrderDetail(new Types.ObjectId(orderId));

    if (!item) {
      throw new HttpException(HttpStatus.BadRequest, "Order not found");
    }

    return item;
  }

  public async getOrderDetailByCode(orderCode: string) {
    const item = await this.orderRepository.getOrderDetailByCode(orderCode);

    if (!item) {
      throw new HttpException(HttpStatus.BadRequest, "Order not found");
    }

    return item;
  }

  public async getOrderByCartId(cartId: string) {
    const item = await this.orderRepository.findByCartId(new Types.ObjectId(cartId));

    if (!item) {
      throw new HttpException(HttpStatus.BadRequest, "Order not found");
    }

    return item;
  }

  public async getOrdersByCustomerId(customerId: string, status?: OrderStatus) {
    return this.orderRepository.getOrdersByCustomerId(customerId, status);
  }

  public async getOrdersForStaff(franchiseId: string, status?: OrderStatus) {
    return this.orderRepository.getOrdersForStaff(franchiseId, status);
  }

  // External dependencies
  public async getById(id: string): Promise<IOrder | null> {
    return this.orderRepository.findById(id);
  }

  public async getByIdWithSession(id: string, session: ClientSession): Promise<IOrder | null> {
    return this.orderRepository.findByIdWithSession(id, session);
  }

  public async confirmOrder(
    id: Types.ObjectId,
    loggedUser: UserAuthPayload | CustomerAuthPayload,
    session?: ClientSession,
  ): Promise<boolean> {
    const order = await this.orderRepository.findByIdWithSession(String(id), session ?? undefined);

    if (!order) {
      throw new HttpException(HttpStatus.BadRequest, "Order not found");
    }

    if (order.status !== OrderStatus.DRAFT) {
      throw new HttpException(HttpStatus.BadRequest, "Order cannot be confirmed");
    }

    const updateOrder = await this.orderRepository.confirmOrder(id, session);
    if (!updateOrder) {
      throw new HttpException(HttpStatus.BadRequest, "Confirm order failed");
    }

    await this.orderStatusLogger.logOrderStatus(
      {
        order_id: order._id,
        old_status: OrderStatus.DRAFT,
        new_status: OrderStatus.CONFIRMED,
        changed_by_customer: loggedUser.type === UserType.CUSTOMER ? new Types.ObjectId(loggedUser.id) : undefined,
        changed_by_staff: loggedUser.type === UserType.USER ? new Types.ObjectId(loggedUser.id) : undefined,
      },
      session,
    );

    return true;
  }

  public async cancelOrder(
    id: Types.ObjectId,
    failed_reason: string,
    loggedUser: UserAuthPayload | CustomerAuthPayload,
    session?: ClientSession,
  ): Promise<boolean> {
    const order = await this.orderRepository.findByIdWithSession(String(id), session);

    if (!order) {
      throw new HttpException(HttpStatus.BadRequest, "Order not found");
    }

    if (order.status !== OrderStatus.CONFIRMED) {
      throw new HttpException(HttpStatus.BadRequest, "Order cannot be canceled");
    }

    const updateOrder = await this.orderRepository.cancelOrder(id, failed_reason, session);
    if (!updateOrder) {
      throw new HttpException(HttpStatus.BadRequest, "Cancel order failed");
    }

    await this.orderStatusLogger.logOrderStatus(
      {
        order_id: order._id,
        old_status: OrderStatus.CONFIRMED,
        new_status: OrderStatus.CANCELLED,
        changed_by_customer: loggedUser.type === UserType.CUSTOMER ? new Types.ObjectId(loggedUser.id) : undefined,
        changed_by_staff: loggedUser.type === UserType.USER ? new Types.ObjectId(loggedUser.id) : undefined,
      },
      session,
    );

    return true;
  }
}
