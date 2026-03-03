import mongoose, { HydratedDocument, Schema } from "mongoose";
import { BASE_MODEL_FIELDS, BaseFieldName, COLLECTION_NAME } from "../../core";
import { ICategoryFranchise } from "./category-franchise.interface";

const CategoryFranchiseSchemaEntity = new Schema({
  [BaseFieldName.CATEGORY_ID]: {
    type: mongoose.Schema.Types.ObjectId,
    ref: COLLECTION_NAME.CATEGORY,
    required: true,
  },
  [BaseFieldName.FRANCHISE_ID]: {
    type: mongoose.Schema.Types.ObjectId,
    ref: COLLECTION_NAME.FRANCHISE,
    required: true,
  },
  [BaseFieldName.DISPLAY_ORDER]: { type: Number, default: 1, min: 1 },

  ...BASE_MODEL_FIELDS,
});

CategoryFranchiseSchemaEntity.index(
  {
    [BaseFieldName.CATEGORY_ID]: 1,
    [BaseFieldName.FRANCHISE_ID]: 1,
  },
  { unique: true, partialFilterExpression: { is_deleted: false } },
);

export type CategoryFranchiseDocument = HydratedDocument<ICategoryFranchise>;
const CategoryFranchiseSchema = mongoose.model<CategoryFranchiseDocument>(
  COLLECTION_NAME.CATEGORY_FRANCHISE,
  CategoryFranchiseSchemaEntity,
);
export default CategoryFranchiseSchema;
