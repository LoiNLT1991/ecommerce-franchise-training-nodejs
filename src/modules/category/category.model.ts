import mongoose, { HydratedDocument, Schema } from "mongoose";
import { BASE_MODEL_FIELDS, BaseFieldName, COLLECTION_NAME } from "../../core";
import { CategoryFieldName } from "./category.enum";
import { ICategory } from "./category.interface";

const CategorySchemaEntity = new Schema({
  [BaseFieldName.CODE]: { type: String, required: true, unique: true },
  [BaseFieldName.NAME]: { type: String, required: true },
  [BaseFieldName.DESCRIPTION]: { type: String },
  [CategoryFieldName.PARENT_ID]: {
    type: mongoose.Schema.Types.ObjectId,
    ref: COLLECTION_NAME.CATEGORY,
    required: false,
  },

  ...BASE_MODEL_FIELDS,
});

export type CategoryDocument = HydratedDocument<ICategory>;
const CategorySchema = mongoose.model<CategoryDocument>(COLLECTION_NAME.CATEGORY, CategorySchemaEntity);
export default CategorySchema;
