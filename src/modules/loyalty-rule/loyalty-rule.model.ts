import mongoose, { HydratedDocument, Schema } from "mongoose";
import { BASE_MODEL_FIELDS, BaseFieldName, BaseLoyaltyTier, COLLECTION_NAME } from "../../core";
import { ILoyaltyRule } from "./loyalty-rule.interface";

const LoyaltyRuleSchemaEntity = new Schema({
  [BaseFieldName.FRANCHISE_ID]: {
    type: mongoose.Schema.Types.ObjectId,
    ref: COLLECTION_NAME.FRANCHISE,
    required: true,
    unique: true,
  },

  // ===== Earn rule =====
  [BaseFieldName.EARN_AMOUNT_PER_POINT]: {
    type: Number,
    required: true,
    default: 10000,
  },

  // ===== Redeem rule =====
  [BaseFieldName.REDEEM_VALUE_PER_POINT]: {
    type: Number,
    required: true,
    default: 1000,
  },

  [BaseFieldName.MIN_REDEEM_POINTS]: {
    type: Number,
    default: 10,
  },

  [BaseFieldName.MAX_REDEEM_POINTS]: {
    type: Number,
  },

  // ===== Tier rules =====
  [BaseFieldName.TIER_RULES]: [
    {
      [BaseFieldName.TIER]: {
        type: String,
        enum: Object.values(BaseLoyaltyTier),
        required: true,
      },

      [BaseFieldName.MIN_POINTS]: {
        type: Number,
        required: true,
      },

      [BaseFieldName.MAX_POINTS]: {
        type: Number,
      },

      // ===== Tier benefits =====
      [BaseFieldName.BENEFIT]: {
        [BaseFieldName.ORDER_DISCOUNT_PERCENT]: { type: Number }, // ví dụ 10%
        [BaseFieldName.EARN_MULTIPLIER]: { type: Number, default: 1 }, // ví dụ 1.5x points
        [BaseFieldName.FREE_SHIPPING]: { type: Boolean, default: false },
      },
    },
  ],

  [BaseFieldName.DESCRIPTION]: {
    type: String,
  },

  ...BASE_MODEL_FIELDS,
});

LoyaltyRuleSchemaEntity.index({ [BaseFieldName.FRANCHISE_ID]: 1 }, { unique: true });

export type LoyaltyRuleDocument = HydratedDocument<ILoyaltyRule>;
const LoyaltyRuleSchema = mongoose.model<LoyaltyRuleDocument>(COLLECTION_NAME.LOYALTY_RULE, LoyaltyRuleSchemaEntity);
export default LoyaltyRuleSchema;
