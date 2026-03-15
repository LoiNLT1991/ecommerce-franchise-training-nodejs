import mongoose, { HydratedDocument, Schema } from "mongoose";
import { BASE_MODEL_FIELDS, BaseFieldName, COLLECTION_NAME, OrderStatus, OrderType, PriceType } from "../../core";
import { IOrder } from "./order.interface";

const OrderSchemaEntity = new Schema({
  [BaseFieldName.CUSTOMER_ID]: {
    type: mongoose.Schema.Types.ObjectId,
    ref: COLLECTION_NAME.CUSTOMER,
    required: true,
  },

  [BaseFieldName.FRANCHISE_ID]: {
    type: mongoose.Schema.Types.ObjectId,
    ref: COLLECTION_NAME.FRANCHISE,
    required: true,
  },

  [BaseFieldName.CART_ID]: {
    type: mongoose.Schema.Types.ObjectId,
    ref: COLLECTION_NAME.CART,
    required: true,
  },

  [BaseFieldName.STAFF_ID]: {
    type: mongoose.Schema.Types.ObjectId,
    ref: COLLECTION_NAME.USER,
    required: false,
  },

  [BaseFieldName.CODE]: { type: String, required: true, unique: true },

  [BaseFieldName.TYPE]: {
    type: String,
    enum: Object.values(OrderType),
    required: true,
  },

  [BaseFieldName.STATUS]: {
    type: String,
    enum: Object.values(OrderStatus),
    default: OrderStatus.DRAFT,
  },

  [BaseFieldName.ADDRESS]: { type: String, required: false },
  [BaseFieldName.PHONE]: { type: String, required: false },
  [BaseFieldName.MESSAGE]: { type: String, required: false },

  // pricing snapshot
  [BaseFieldName.PROMOTION_DISCOUNT]: { type: Number, default: 0 },
  [BaseFieldName.VOUCHER_DISCOUNT]: { type: Number, default: 0 },
  [BaseFieldName.LOYALTY_DISCOUNT]: { type: Number, default: 0 },
  [BaseFieldName.SUBTOTAL_AMOUNT]: { type: Number, default: 0 },
  [BaseFieldName.FINAL_AMOUNT]: { type: Number, default: 0 },

  // --- Promotion ---
  [BaseFieldName.PROMOTION_ID]: {
    type: mongoose.Schema.Types.ObjectId,
    ref: COLLECTION_NAME.PROMOTION,
    required: false,
  },
  [BaseFieldName.PROMOTION_TYPE]: { type: String, enum: Object.values(PriceType), default: PriceType.DEFAULT },
  [BaseFieldName.PROMOTION_VALUE]: { type: Number, default: 0 },

  // voucher snapshot
  [BaseFieldName.VOUCHER_CODE]: { type: String, required: false },
  [BaseFieldName.VOUCHER_TYPE]: { type: String, enum: Object.values(PriceType), default: PriceType.DEFAULT },
  [BaseFieldName.VOUCHER_VALUE]: { type: Number, default: 0 },

  // --- Loyalty ---
  [BaseFieldName.LOYALTY_POINTS_USED]: { type: Number, default: 0 }, // tổng point đã dùng

  // lifecycle
  [BaseFieldName.DRAFT_AT]: { type: Date },
  [BaseFieldName.CONFIRMED_AT]: { type: Date, default: null },
  [BaseFieldName.COMPLETED_AT]: { type: Date, default: null },
  [BaseFieldName.CANCELLED_AT]: { type: Date, default: null },
  [BaseFieldName.FAILED_REASON]: { type: String, required: false },

  [BaseFieldName.CREATED_BY]: {
    type: mongoose.Schema.Types.ObjectId,
    ref: COLLECTION_NAME.USER,
    required: false,
  },

  ...BASE_MODEL_FIELDS,
});

OrderSchemaEntity.index({ franchise_id: 1, created_at: -1 });
OrderSchemaEntity.index({ customer_id: 1, created_at: -1 });
OrderSchemaEntity.virtual("order_items", {
  ref: COLLECTION_NAME.ORDER_ITEM,
  localField: "_id",
  foreignField: "order_id",
});

export type OrderDocument = HydratedDocument<IOrder>;
const OrderSchema = mongoose.model<OrderDocument>(COLLECTION_NAME.ORDER, OrderSchemaEntity);
export default OrderSchema;
