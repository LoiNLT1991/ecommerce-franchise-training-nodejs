import mongoose, { HydratedDocument, Schema } from "mongoose";
import { BASE_MODEL_FIELDS, BaseFieldName, COLLECTION_NAME, PaymentMethod, PaymentStatus } from "../../core";
import { IPayment } from "./payment.interface";

const PaymentSchemaEntity = new Schema({
  [BaseFieldName.FRANCHISE_ID]: {
    type: mongoose.Schema.Types.ObjectId,
    ref: COLLECTION_NAME.FRANCHISE,
    required: true,
    index: true,
  },

  [BaseFieldName.CUSTOMER_ID]: {
    type: mongoose.Schema.Types.ObjectId,
    ref: COLLECTION_NAME.CUSTOMER,
    required: true,
    index: true,
  },

  [BaseFieldName.ORDER_ID]: {
    type: mongoose.Schema.Types.ObjectId,
    ref: COLLECTION_NAME.ORDER,
    required: true,
    index: true,
  },

  [BaseFieldName.METHOD]: {
    type: String,
    enum: Object.values(PaymentMethod),
    required: true,
  },

  [BaseFieldName.STATUS]: {
    type: String,
    enum: Object.values(PaymentStatus),
    default: PaymentStatus.PENDING,
  },

  [BaseFieldName.AMOUNT]: { type: Number, required: true, min: 0 },
  [BaseFieldName.PROVIDER_TXN_ID]: { type: String, required: false },
  [BaseFieldName.PAID_AT]: { type: Date },

  [BaseFieldName.CREATED_BY]: {
    type: mongoose.Schema.Types.ObjectId,
    ref: COLLECTION_NAME.USER,
    required: false,
  },

  ...BASE_MODEL_FIELDS,
});

PaymentSchemaEntity.index({ order_id: 1 });
PaymentSchemaEntity.index({ franchise_id: 1, created_at: -1 });
PaymentSchemaEntity.index({ provider_txn_id: 1 });

export type PaymentDocument = HydratedDocument<IPayment>;
const PaymentSchema = mongoose.model<PaymentDocument>(COLLECTION_NAME.PAYMENT, PaymentSchemaEntity);
export default PaymentSchema;
