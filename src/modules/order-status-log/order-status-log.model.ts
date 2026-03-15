import mongoose, { HydratedDocument, Schema } from "mongoose";
import { BASE_MODEL_FIELDS, BaseFieldName, COLLECTION_NAME, OrderStatus } from "../../core";
import { IOrderStatusLog } from "./order-status-log.interface";

const OrderStatusLogSchemaEntity = new Schema({
  [BaseFieldName.ORDER_ID]: {
    type: mongoose.Schema.Types.ObjectId,
    ref: COLLECTION_NAME.ORDER,
    required: true,
    index: true,
  },

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

  [BaseFieldName.OLD_STATUS]: { type: String, enum: Object.values(OrderStatus), required: false },
  [BaseFieldName.NEW_STATUS]: { type: String, enum: Object.values(OrderStatus), required: true },
  [BaseFieldName.NOTE]: { type: String, required: false },
  [BaseFieldName.CHANGED_AT]: { type: Date, default: Date.now },

  ...BASE_MODEL_FIELDS,
});

OrderStatusLogSchemaEntity.index({ order_id: 1, created_at: 1 });

export type OrderStatusLogDocument = HydratedDocument<IOrderStatusLog>;
const OrderStatusLogSchema = mongoose.model<OrderStatusLogDocument>(
  COLLECTION_NAME.ORDER_STATUS_LOG,
  OrderStatusLogSchemaEntity,
);
export default OrderStatusLogSchema;
