import mongoose, { HydratedDocument, Schema } from "mongoose";
import { BaseFieldName, BaseModelFields, COLLECTION_NAME } from "../../core";
import { IProductCategoryFranchise } from "./product-category-franchise.interface";

const ProductCategoryFranchiseSchemaEntity = new Schema({
  [BaseFieldName.CATEGORY_FRANCHISE_ID]: {
    type: mongoose.Schema.Types.ObjectId,
    ref: COLLECTION_NAME.CATEGORY_FRANCHISE,
    required: true,
  },
  [BaseFieldName.PRODUCT_FRANCHISE_ID]: {
    type: mongoose.Schema.Types.ObjectId,
    ref: COLLECTION_NAME.PRODUCT_FRANCHISE,
    required: true,
  },
  [BaseFieldName.DISPLAY_ORDER]: { type: Number, default: 1 },

  ...BaseModelFields,
});

ProductCategoryFranchiseSchemaEntity.index(
  {
    [BaseFieldName.CATEGORY_FRANCHISE_ID]: 1,
    [BaseFieldName.PRODUCT_FRANCHISE_ID]: 1,
  },
  { unique: true, partialFilterExpression: { is_deleted: false } },
);

export type ProductCategoryFranchiseDocument = HydratedDocument<IProductCategoryFranchise>;
const ProductCategoryFranchiseSchema = mongoose.model<ProductCategoryFranchiseDocument>(
  COLLECTION_NAME.PRODUCT_CATEGORY_FRANCHISE,
  ProductCategoryFranchiseSchemaEntity,
);
export default ProductCategoryFranchiseSchema;
