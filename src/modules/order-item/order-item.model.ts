import mongoose, { HydratedDocument, Schema } from "mongoose";
import { BASE_MODEL_FIELDS, BaseFieldName, COLLECTION_NAME } from "../../core";
import { IOrderItem } from "./order-item.interface";

const OrderItemSchemaEntity = new Schema({
  [BaseFieldName.ORDER_ID]: {
    type: mongoose.Schema.Types.ObjectId,
    ref: COLLECTION_NAME.ORDER,
    required: true,
    index: true,
  },

  [BaseFieldName.PRODUCT_FRANCHISE_ID]: {
    type: mongoose.Schema.Types.ObjectId,
    ref: COLLECTION_NAME.PRODUCT_FRANCHISE,
    required: true,
  },

  [BaseFieldName.QUANTITY]: { type: Number, required: true, min: 1, default: 1 },
  [BaseFieldName.PRICE_SNAPSHOT]: { type: Number, default: 0, required: true },
  [BaseFieldName.DISCOUNT_AMOUNT]: { type: Number, default: 0 },
  [BaseFieldName.LINE_TOTAL]: { type: Number, default: 0 },
  [BaseFieldName.FINAL_LINE_TOTAL]: { type: Number, default: 0 },
  [BaseFieldName.OPTIONS_HASH]: { type: String, default: "", required: false },
  [BaseFieldName.OPTIONS]: [
    {
      [BaseFieldName.PRODUCT_FRANCHISE_ID]: {
        type: mongoose.Schema.Types.ObjectId,
        ref: COLLECTION_NAME.PRODUCT_FRANCHISE,
        required: true,
      },
      [BaseFieldName.QUANTITY]: { type: Number, min: 1, required: true },
      [BaseFieldName.PRICE_SNAPSHOT]: { type: Number, required: true },
      [BaseFieldName.DISCOUNT_AMOUNT]: { type: Number, default: 0 },
      [BaseFieldName.FINAL_PRICE]: { type: Number, default: 0 },
    },
  ],

  ...BASE_MODEL_FIELDS,
});

export type OrderItemDocument = HydratedDocument<IOrderItem>;
const OrderItemSchema = mongoose.model<OrderItemDocument>(COLLECTION_NAME.ORDER_ITEM, OrderItemSchemaEntity);
export default OrderItemSchema;
