import mongoose, { HydratedDocument, Schema } from "mongoose";
import { COLLECTION_NAME } from "../../core/constants";
import { BaseFieldName } from "../../core/enums";
import { BaseModelFields } from "../../core/models";
import { ProductFieldName } from "./product.enum";
import { IProduct } from "./product.interface";

const ProductSchemaEntity = new Schema({
  [ProductFieldName.SKU]: { type: String, required: true, unique: true },
  [BaseFieldName.NAME]: { type: String, required: true },
  [BaseFieldName.DESCRIPTION]: { type: String, required: true },
  [ProductFieldName.CONTENT]: { type: String, required: true },
  [ProductFieldName.IMAGE_URL]: { type: String, required: true },
  [ProductFieldName.IMAGES_URL]: { type: [String], default: [] },
  [ProductFieldName.MIN_PRICE]: { type: Number, min: 0, default: 0 },
  [ProductFieldName.MAX_PRICE]: { type: Number, min: 0, default: 0 },

  ...BaseModelFields,
});

export type ProductDocument = HydratedDocument<IProduct>;
const ProductSchema = mongoose.model<ProductDocument>(COLLECTION_NAME.PRODUCT, ProductSchemaEntity);
export default ProductSchema;
