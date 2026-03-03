import mongoose, { HydratedDocument, Schema } from "mongoose";
import { BaseFieldName, BASE_MODEL_FIELDS, COLLECTION_NAME } from "../../core";
import { IInventory } from "./inventory.interface";

const InventorySchemaEntity = new Schema({
  [BaseFieldName.PRODUCT_FRANCHISE_ID]: {
    type: mongoose.Schema.Types.ObjectId,
    ref: COLLECTION_NAME.PRODUCT_FRANCHISE,
    required: true,
    index: true,
  },
  [BaseFieldName.QUANTITY]: { type: Number, required: true, min: 0 },
  [BaseFieldName.RESERVED_QUANTITY]: { type: Number, default: 0, min: 0 },
  [BaseFieldName.ALERT_THRESHOLD]: { type: Number, default: 10, min: 0 },

  ...BASE_MODEL_FIELDS,
});

export type InventoryDocument = HydratedDocument<IInventory>;
const InventorySchema = mongoose.model<InventoryDocument>(COLLECTION_NAME.INVENTORY, InventorySchemaEntity);
export default InventorySchema;
