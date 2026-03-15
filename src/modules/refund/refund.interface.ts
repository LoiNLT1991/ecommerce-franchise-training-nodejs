import { Document, Types } from "mongoose";
import { BaseFieldName, IBase, RefundStatus } from "../../core";

export interface IRefund extends Document, IBase {
  [BaseFieldName.PAYMENT_ID]: Types.ObjectId;
  [BaseFieldName.AMOUNT]: number;
  [BaseFieldName.REASON]: string;
  [BaseFieldName.STATUS]: RefundStatus;
  [BaseFieldName.CREATED_BY]?: Types.ObjectId;
  [BaseFieldName.CREATED_NAME]?: string;

  [BaseFieldName.APPROVE_AT]: Date;
  [BaseFieldName.REJECTED_AT]?: Date;
  [BaseFieldName.REASON_REJECT]?: String;
  [BaseFieldName.COMPLETED_AT]: Date;
}

export interface IRefundQuery {
  getById(id: string): Promise<IRefund | null>;
}
