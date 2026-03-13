import { Document, Types } from "mongoose";
import { BaseFieldName, CartStatus, IBase, PriceType } from "../../core";

export interface ICart extends Document, IBase {
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
  [BaseFieldName.STATUS]: CartStatus;
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
}

export interface IPromotionResult {
  promotionId?: Types.ObjectId;
  type?: PriceType;
  value?: number;
  discount: number;
}

export interface IVoucherResult {
  voucherId?: Types.ObjectId;
  code?: string;
  type?: PriceType;
  value?: number;
  discount: number;
}
