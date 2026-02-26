import mongoose, { HydratedDocument, Schema } from "mongoose";
import { ICustomerFranchise } from "./customer-franchise.interface";
import { BaseFieldName, BaseModelFields, COLLECTION_NAME } from "../../core";
import { BaseLoyaltyTier } from "../../core/enums/base.enum";

const CustomerFranchiseSchemaEntity = new Schema({
  [BaseFieldName.CUSTOMER_ID]: {
    type: Schema.Types.ObjectId,
    ref: COLLECTION_NAME.CUSTOMER,
    required: true,
    index: true,
  },
  [BaseFieldName.FRANCHISE_ID]: {
    type: Schema.Types.ObjectId,
    ref: COLLECTION_NAME.FRANCHISE,
    required: true,
    index: true,
  },
  [BaseFieldName.LOYALTY_POINTS]: { type: Number, default: 0 }, // 10.000 VND = 1 point
  [BaseFieldName.LOYALTY_TIER]: { type: String, enum: Object.values(BaseLoyaltyTier), default: BaseLoyaltyTier.BRONZE },
  [BaseFieldName.TOTAL_EARNED_POINTS]: { type: Number, default: 0 },
  [BaseFieldName.FIRST_ORDER_DATE]: { type: Date, default: Date.now },
  [BaseFieldName.LAST_ORDER_DATE]: { type: Date, default: Date.now },

  ...BaseModelFields,
});

CustomerFranchiseSchemaEntity.index(
  {
    [BaseFieldName.CUSTOMER_ID]: 1,
    [BaseFieldName.FRANCHISE_ID]: 1,
  },
  {
    unique: true,
    partialFilterExpression: { is_deleted: false },
  },
);

CustomerFranchiseSchemaEntity.index({
  [BaseFieldName.FRANCHISE_ID]: 1,
  [BaseFieldName.TOTAL_EARNED_POINTS]: -1,
});

export type CustomerFranchiseDocument = HydratedDocument<ICustomerFranchise>;
const CustomerFranchiseSchema = mongoose.model<CustomerFranchiseDocument>(
  COLLECTION_NAME.CUSTOMER_FRANCHISE,
  CustomerFranchiseSchemaEntity,
);
export default CustomerFranchiseSchema;
