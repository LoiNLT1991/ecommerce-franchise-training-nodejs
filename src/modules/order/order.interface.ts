import { Types } from "mongoose";
import { BaseFieldName, IBase, OrderType, PriceType } from "../../core";

export interface IOrder extends Document, IBase {
  [BaseFieldName.FRANCHISE_ID]: Types.ObjectId;
  [BaseFieldName.FRANCHISE_NAME]?: string;
  [BaseFieldName.CUSTOMER_ID]: Types.ObjectId;
  [BaseFieldName.CUSTOMER_NAME]?: string;
  [BaseFieldName.CUSTOMER_EMAIL]?: string;
  [BaseFieldName.CUSTOMER_PHONE]?: string;
  [BaseFieldName.CART_ID]: string;
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
  [BaseFieldName.LOYALTY_POINTS_USED]?: number;
  [BaseFieldName.PROMOTION_DISCOUNT]: number;
  [BaseFieldName.VOUCHER_DISCOUNT]: number;
  [BaseFieldName.LOYALTY_DISCOUNT]: number;
  [BaseFieldName.SUBTOTAL_AMOUNT]: number;
  [BaseFieldName.FINAL_AMOUNT]: number;

  [BaseFieldName.CODE]: string;
  [BaseFieldName.TYPE]: OrderType;
  [BaseFieldName.STATUS]: OrderType;
  [BaseFieldName.CONFIRMED_AT]: Date;
  [BaseFieldName.COMPLETED_AT]: Date;
  [BaseFieldName.CANCELLED_AT]: Date;
  [BaseFieldName.FAILED_REASON]?: string;
}
