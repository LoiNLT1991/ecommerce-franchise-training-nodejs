import { ClientSession, Document, Types } from "mongoose";
import { BaseFieldName, IBase, OrderStatus } from "../../core";

export interface IOrderStatusLog extends Document, IBase {
  [BaseFieldName.ORDER_ID]: Types.ObjectId;
  [BaseFieldName.ORDER_CODE]?: string;
  [BaseFieldName.CHANGED_BY_STAFF]: Types.ObjectId;
  [BaseFieldName.CHANGED_BY_CUSTOMER]: Types.ObjectId;
  [BaseFieldName.OLD_STATUS]: OrderStatus;
  [BaseFieldName.NEW_STATUS]: OrderStatus;
  [BaseFieldName.NOTE]: string;
}

export interface IOrderStatusLogPayload {
  order_id: Types.ObjectId;
  old_status: OrderStatus;
  new_status: OrderStatus;
  changed_by_staff?: Types.ObjectId;
  changed_by_customer?: Types.ObjectId;
  note?: string;
}

export interface IOrderStatusLogger {
  logOrderStatus(payload: IOrderStatusLogPayload, session?: ClientSession): Promise<void>;
}
