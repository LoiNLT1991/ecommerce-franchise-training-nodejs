import mongoose, { HydratedDocument, Schema } from "mongoose";
import { BASE_MODEL_FIELDS, BaseFieldName, COLLECTION_NAME, RefundStatus } from "../../core";
import { IRefund } from "./refund.interface";

const RefundSchemaEntity = new Schema({
  [BaseFieldName.PAYMENT_ID]: {
    type: mongoose.Schema.Types.ObjectId,
    ref: COLLECTION_NAME.PAYMENT,
    required: true,
    index: true,
  },

  [BaseFieldName.AMOUNT]: { type: Number, required: true, min: 0 },
  [BaseFieldName.REASON]: { type: String, required: false },
  [BaseFieldName.STATUS]: { type: String, enum: Object.values(RefundStatus), default: RefundStatus.REQUESTED },

  // lifecycle
  [BaseFieldName.APPROVE_AT]: { type: Date },
  [BaseFieldName.REJECTED_AT]: { type: Date },
  [BaseFieldName.REASON_REJECT]: { type: String, required: false },
  [BaseFieldName.COMPLETED_AT]: { type: Date },

  [BaseFieldName.CREATED_BY]: {
    type: mongoose.Schema.Types.ObjectId,
    ref: COLLECTION_NAME.USER,
    required: false,
  },

  ...BASE_MODEL_FIELDS,
});

RefundSchemaEntity.index({ payment_id: 1 });
RefundSchemaEntity.index({ created_at: -1 });

export type RefundDocument = HydratedDocument<IRefund>;
const RefundSchema = mongoose.model<RefundDocument>(COLLECTION_NAME.REFUND, RefundSchemaEntity);
export default RefundSchema;
