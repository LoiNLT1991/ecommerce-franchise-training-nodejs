import mongoose, { HydratedDocument, Schema } from "mongoose";
import { COLLECTION_NAME } from "../../core/constants";
import { BaseFieldName } from "../../core/enums";
import { BaseModelFields } from "../../core/models";
import { IProductFranchise } from "./product-franchise.interface";

const ProductFranchiseSchemaEntity = new Schema({
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: COLLECTION_NAME.PRODUCT,
    required: true,
  },
  franchise_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: COLLECTION_NAME.FRANCHISE,
    required: true,
  },
  [BaseFieldName.SIZE]: { type: String, required: true },
  [BaseFieldName.PRICE_BASE]: { type: Number, required: true, min: 0 },

  ...BaseModelFields,
});

ProductFranchiseSchemaEntity.index(
  {
    product_id: 1,
    franchise_id: 1,
    size: 1
  },
  { unique: true },
);

export type ProductFranchiseDocument = HydratedDocument<IProductFranchise>;
const ProductFranchiseSchema = mongoose.model<ProductFranchiseDocument>(
  COLLECTION_NAME.PRODUCT_FRANCHISE,
  ProductFranchiseSchemaEntity,
);
export default ProductFranchiseSchema;
