import mongoose, { HydratedDocument, Schema } from "mongoose";
import { BaseFieldName, BaseModelFields, COLLECTION_NAME } from "../../core";
import { ICart } from "./cart.interface";

const CartSchemaEntity = new Schema({
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
  [BaseFieldName.STAFF_ID]: {
    type: mongoose.Schema.Types.ObjectId,
    ref: COLLECTION_NAME.USER,
    required: false,
  },
  [BaseFieldName.STATUS]: { type: String, required: true }, // ACTIVE / CHECKED_OUT

  ...BaseModelFields,
});

export type CartDocument = HydratedDocument<ICart>;
const CartSchema = mongoose.model<CartDocument>(COLLECTION_NAME.CATEGORY, CartSchemaEntity);
export default CartSchema;
