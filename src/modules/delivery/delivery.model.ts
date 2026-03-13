import mongoose, { HydratedDocument, Schema } from "mongoose";
import { BASE_MODEL_FIELDS, BaseFieldName, COLLECTION_NAME, DeliveryStatus } from "../../core";
import { IDelivery } from "./delivery.interface";

const DeliverySchemaEntity = new Schema({
  [BaseFieldName.ORDER_ID]: {
    type: mongoose.Schema.Types.ObjectId,
    ref: COLLECTION_NAME.ORDER,
    required: true,
    index: true,
  },

  [BaseFieldName.CUSTOMER_ID]: {
    type: mongoose.Schema.Types.ObjectId,
    ref: COLLECTION_NAME.CUSTOMER,
    required: true,
  },

  [BaseFieldName.ASSIGNED_BY]: {
    type: mongoose.Schema.Types.ObjectId,
    ref: COLLECTION_NAME.USER,
    required: true,
  },

  [BaseFieldName.ASSIGNED_TO]: {
    type: mongoose.Schema.Types.ObjectId,
    ref: COLLECTION_NAME.USER,
    required: true,
  },

  [BaseFieldName.STATUS]: {
    type: String,
    enum: Object.values(DeliveryStatus),
    default: DeliveryStatus.ASSIGNED,
  },

  // lifecycle
  [BaseFieldName.ASSIGNED_AT]: { type: Date },
  [BaseFieldName.PICKED_UP_AT]: { type: Date },
  [BaseFieldName.DELIVERED_AT]: { type: Date },
  [BaseFieldName.FAILED_REASON]: { type: String, required: false },

  ...BASE_MODEL_FIELDS,
});

DeliverySchemaEntity.index({ assigned_by: 1, status: 1 });
DeliverySchemaEntity.index({ assigned_to: 1, status: 1 });
DeliverySchemaEntity.index({ customer_id: 1, created_at: -1 });

export type DeliveryDocument = HydratedDocument<IDelivery>;
const DeliverySchema = mongoose.model<DeliveryDocument>(COLLECTION_NAME.DELIVERY, DeliverySchemaEntity);
export default DeliverySchema;
