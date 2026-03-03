import mongoose, { HydratedDocument, Schema } from "mongoose";
import { IProductFranchise } from "./product-franchise.interface";
import { BASE_MODEL_FIELDS, BaseFieldName, COLLECTION_NAME } from "../../core";

const ProductFranchiseSchemaEntity = new Schema({
  [BaseFieldName.PRODUCT_ID]: {
    type: mongoose.Schema.Types.ObjectId,
    ref: COLLECTION_NAME.PRODUCT,
    required: true,
  },
  [BaseFieldName.FRANCHISE_ID]: {
    type: mongoose.Schema.Types.ObjectId,
    ref: COLLECTION_NAME.FRANCHISE,
    required: true,
  },
  [BaseFieldName.PRICE_BASE]: { type: Number, required: true, min: 0 },
  [BaseFieldName.SIZE]: { type: String, required: false, default: "DEFAULT" },

  ...BASE_MODEL_FIELDS,
});

ProductFranchiseSchemaEntity.index(
  {
    [BaseFieldName.PRODUCT_ID]: 1,
    [BaseFieldName.FRANCHISE_ID]: 1,
    [BaseFieldName.SIZE]: 1,
  },
  { unique: true, partialFilterExpression: { is_deleted: false } },
);

export type ProductFranchiseDocument = HydratedDocument<IProductFranchise>;
const ProductFranchiseSchema = mongoose.model<ProductFranchiseDocument>(
  COLLECTION_NAME.PRODUCT_FRANCHISE,
  ProductFranchiseSchemaEntity,
);
export default ProductFranchiseSchema;
