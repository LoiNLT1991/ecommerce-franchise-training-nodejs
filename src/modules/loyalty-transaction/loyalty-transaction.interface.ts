import { ClientSession, Document, Types } from "mongoose";
import { BaseFieldName, IBase, LoyaltyTransactionType } from "../../core";

export interface ILoyaltyTransaction extends Document, IBase {
  [BaseFieldName.CUSTOMER_FRANCHISE_ID]: Types.ObjectId;
  [BaseFieldName.ORDER_ID]: Types.ObjectId;
  [BaseFieldName.POINT_CHANGE]: number;
  [BaseFieldName.TYPE]: LoyaltyTransactionType;
  [BaseFieldName.REASON]: string;
  [BaseFieldName.CHANGED_BY_STAFF]: Types.ObjectId;
  [BaseFieldName.CHANGED_BY_CUSTOMER]: Types.ObjectId;
}

export interface ILoyaltyTransactionPayload {
  customer_franchise_id: Types.ObjectId;
  order_id: Types.ObjectId;
  point_change: number;
  type: LoyaltyTransactionType;
  reason?: string;
  changed_by_staff?: Types.ObjectId;
  changed_by_customer?: Types.ObjectId;
}

export interface ILoyaltyTransactionLogger {
  logLoyaltyTransaction(payload: ILoyaltyTransactionPayload, session?: ClientSession): Promise<void>;
  findEarnByOrderId(orderId: string, session?: ClientSession): Promise<ILoyaltyTransaction | null>;
}
