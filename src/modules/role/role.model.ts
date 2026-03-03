import mongoose, { HydratedDocument, Schema } from "mongoose";
import { BASE_MODEL_FIELDS, BaseFieldName, COLLECTION_NAME, RoleScope } from "../../core";
import { IRole } from "./role.interface";

const RoleSchemaEntity = new Schema({
  [BaseFieldName.CODE]: { type: String, required: true },
  [BaseFieldName.NAME]: { type: String, required: true },
  [BaseFieldName.DESCRIPTION]: { type: String },
  [BaseFieldName.SCOPE]: { type: String, enum: Object.values(RoleScope), required: true, default: RoleScope.FRANCHISE },

  ...BASE_MODEL_FIELDS,
});

export type RoleDocument = HydratedDocument<IRole>;
const RoleSchema = mongoose.model<RoleDocument>(COLLECTION_NAME.ROLE, RoleSchemaEntity);
export default RoleSchema;
