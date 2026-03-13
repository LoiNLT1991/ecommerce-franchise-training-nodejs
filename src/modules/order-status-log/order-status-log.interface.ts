import { Types } from "mongoose";
import { BaseFieldName, IBase, OrderStatus } from "../../core";

export interface IOrderStatusLog extends Document, IBase {
  [BaseFieldName.ORDER_ID]: Types.ObjectId;
  [BaseFieldName.ORDER_CODE]?: string;
  [BaseFieldName.CHANGED_BY]: Types.ObjectId;
  [BaseFieldName.OLD_STATUS]: OrderStatus;
  [BaseFieldName.NEW_STATUS]: OrderStatus;
  [BaseFieldName.NOTE]: string;
}
