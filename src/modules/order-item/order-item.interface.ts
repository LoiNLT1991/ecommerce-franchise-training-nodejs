import { Types } from "mongoose";
import { BaseFieldName, IBase, IDetailItemOption } from "../../core";

export interface IOrderItem extends Document, IBase {
  [BaseFieldName.ORDER_ID]: Types.ObjectId;
  [BaseFieldName.PRODUCT_FRANCHISE_ID]: Types.ObjectId;
  [BaseFieldName.NOTE]?: string;
  [BaseFieldName.QUANTITY]: number;
  [BaseFieldName.PRODUCT_CART_PRICE]: number; // giá hiện tại của product
  [BaseFieldName.DISCOUNT_AMOUNT]: number; // discount theo product
  [BaseFieldName.LINE_TOTAL]: number;
  [BaseFieldName.FINAL_LINE_TOTAL]: number;
  [BaseFieldName.OPTIONS_HASH]: string;
  [BaseFieldName.OPTIONS]: IDetailItemOption[];
}
