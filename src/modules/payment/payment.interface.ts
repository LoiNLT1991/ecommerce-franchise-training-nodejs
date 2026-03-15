import { ClientSession, Document, Types } from "mongoose";
import { BaseFieldName, CustomerAuthPayload, IBase, PaymentMethod, PaymentStatus, UserAuthPayload } from "../../core";
import { IOrder } from "../order";

export interface IPayment extends Document, IBase {
  [BaseFieldName.FRANCHISE_ID]: Types.ObjectId;
  [BaseFieldName.FRANCHISE_NAME]?: string;
  [BaseFieldName.CUSTOMER_ID]: Types.ObjectId;
  [BaseFieldName.CUSTOMER_NAME]?: string;
  [BaseFieldName.CUSTOMER_EMAIL]?: string;
  [BaseFieldName.CUSTOMER_PHONE]?: string;
  [BaseFieldName.ORDER_ID]: Types.ObjectId;
  [BaseFieldName.METHOD]: PaymentMethod;
  [BaseFieldName.STATUS]: PaymentStatus;
  [BaseFieldName.AMOUNT]: number;
  [BaseFieldName.PROVIDER_TXN_ID]: string;
  [BaseFieldName.PAID_AT]: Date;
  [BaseFieldName.CREATED_BY]?: Types.ObjectId;
  [BaseFieldName.CREATED_NAME]?: string;
  [BaseFieldName.CODE]: string;
}

export interface IPaymentQuery {
  createPayment(
    payload: IOrder,
    loggedUser: UserAuthPayload | CustomerAuthPayload,
    session?: ClientSession,
  ): Promise<IPayment>;
  getById(id: string): Promise<IPayment | null>;
}
