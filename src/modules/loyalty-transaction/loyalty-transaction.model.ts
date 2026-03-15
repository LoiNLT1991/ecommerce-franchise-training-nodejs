import mongoose, { HydratedDocument, Schema } from "mongoose";
import { BASE_MODEL_FIELDS, BaseFieldName, COLLECTION_NAME, LoyaltyTransactionType } from "../../core";
import { ILoyaltyTransaction } from "./loyalty-transaction.interface";

const LoyaltyTransactionSchemaEntity = new Schema({
  [BaseFieldName.CUSTOMER_FRANCHISE_ID]: {
    type: mongoose.Schema.Types.ObjectId,
    ref: COLLECTION_NAME.CUSTOMER_FRANCHISE,
    required: true,
    index: true,
  },

  [BaseFieldName.ORDER_ID]: {
    type: mongoose.Schema.Types.ObjectId,
    ref: COLLECTION_NAME.ORDER,
    required: false,
    index: true,
  },

  [BaseFieldName.TYPE]: { type: String, enum: Object.values(LoyaltyTransactionType), required: true },
  [BaseFieldName.POINT_CHANGE]: { type: Number, required: true },
  [BaseFieldName.REASON]: { type: String, required: false },

  [BaseFieldName.CHANGED_BY_STAFF]: {
    type: mongoose.Schema.Types.ObjectId,
    ref: COLLECTION_NAME.USER,
    required: false,
  },

  [BaseFieldName.CHANGED_BY_CUSTOMER]: {
    type: mongoose.Schema.Types.ObjectId,
    ref: COLLECTION_NAME.CUSTOMER,
    required: false,
  },

  ...BASE_MODEL_FIELDS,
});

LoyaltyTransactionSchemaEntity.index({ customer_franchise_id: 1, created_at: -1 });

export type LoyaltyTransactionDocument = HydratedDocument<ILoyaltyTransaction>;
const LoyaltyTransactionSchema = mongoose.model<LoyaltyTransactionDocument>(
  COLLECTION_NAME.LOYALTY_TRANSACTION,
  LoyaltyTransactionSchemaEntity,
);
export default LoyaltyTransactionSchema;
