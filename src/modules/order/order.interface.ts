import { ClientSession, Document, Types } from "mongoose";
import {
  BaseFieldName,
  CustomerAuthPayload,
  IBase,
  OrderStatus,
  OrderType,
  PriceType,
  UserAuthPayload,
} from "../../core";
import { ICart } from "../cart";

export interface IOrder extends Document, IBase {
  [BaseFieldName.CART_ID]: Types.ObjectId;
  [BaseFieldName.FRANCHISE_ID]: Types.ObjectId;
  [BaseFieldName.FRANCHISE_NAME]?: string;
  [BaseFieldName.CUSTOMER_ID]: Types.ObjectId;
  [BaseFieldName.CUSTOMER_NAME]?: string;
  [BaseFieldName.CUSTOMER_EMAIL]?: string;
  [BaseFieldName.CUSTOMER_PHONE]?: string;
  [BaseFieldName.ADDRESS]?: string;
  [BaseFieldName.PHONE]?: string;
  [BaseFieldName.MESSAGE]?: string;
  [BaseFieldName.STAFF_ID]?: Types.ObjectId;
  [BaseFieldName.STAFF_NAME]?: string;
  [BaseFieldName.PROMOTION_ID]?: Types.ObjectId;
  [BaseFieldName.PROMOTION_TYPE]?: PriceType;
  [BaseFieldName.PROMOTION_VALUE]?: number;
  [BaseFieldName.VOUCHER_ID]?: Types.ObjectId;
  [BaseFieldName.VOUCHER_CODE]?: string;
  [BaseFieldName.VOUCHER_TYPE]?: PriceType;
  [BaseFieldName.VOUCHER_VALUE]?: number;
  [BaseFieldName.LOYALTY_POINTS_USED]: number;
  [BaseFieldName.PROMOTION_DISCOUNT]: number;
  [BaseFieldName.VOUCHER_DISCOUNT]: number;
  [BaseFieldName.LOYALTY_DISCOUNT]: number;
  [BaseFieldName.SUBTOTAL_AMOUNT]: number;
  [BaseFieldName.FINAL_AMOUNT]: number;

  [BaseFieldName.CODE]: string;
  [BaseFieldName.TYPE]: OrderType;
  [BaseFieldName.STATUS]: OrderStatus;
  [BaseFieldName.DRAFT_AT]: Date;
  [BaseFieldName.CONFIRMED_AT]: Date;
  [BaseFieldName.COMPLETED_AT]: Date;
  [BaseFieldName.CANCELLED_AT]: Date;
  [BaseFieldName.FAILED_REASON]?: string;
  [BaseFieldName.CREATED_BY]?: Types.ObjectId;
}

export interface IOrderQuery {
  getById(id: string): Promise<IOrder | null>;
  getByIdWithSession(id: string, session: ClientSession): Promise<IOrder | null>;
  createOrder(
    payload: ICart,
    loggedUser: UserAuthPayload | CustomerAuthPayload,
    session?: ClientSession,
  ): Promise<IOrder>;
  confirmOrder(
    id: Types.ObjectId,
    loggedUser: UserAuthPayload | CustomerAuthPayload,
    session?: ClientSession,
  ): Promise<boolean>;
  cancelOrder(
    id: Types.ObjectId,
    failed_reason: string,
    loggedUser: UserAuthPayload | CustomerAuthPayload,
    session?: ClientSession,
  ): Promise<boolean>;
  countItems(franchiseId?: Types.ObjectId): Promise<Record<string, number>>;
}
