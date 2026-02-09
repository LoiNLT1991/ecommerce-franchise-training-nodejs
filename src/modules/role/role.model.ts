import mongoose, { HydratedDocument, Schema } from "mongoose";
import { COLLECTION_NAME } from "../../core/constants";
import { RoleScope } from "../../core/enums";
import { BaseModelFields } from "../../core/models";
import { RoleFieldName } from "./role.enum";
import { IRole } from "./role.interface";

const RoleSchemaEntity = new Schema({
  [RoleFieldName.CODE]: { type: String, required: true },
  [RoleFieldName.NAME]: { type: String, required: true },
  [RoleFieldName.SCOPE]: { type: String, enum: Object.values(RoleScope), required: true, default: RoleScope.FRANCHISE },
  [RoleFieldName.DESCRIPTION]: { type: String },

  ...BaseModelFields,
});

export type RoleDocument = HydratedDocument<IRole>;
const RoleSchema = mongoose.model<RoleDocument>(COLLECTION_NAME.ROLE, RoleSchemaEntity);
export default RoleSchema;
