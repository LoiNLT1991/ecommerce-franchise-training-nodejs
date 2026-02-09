import mongoose, { HydratedDocument, Schema } from "mongoose";
import { COLLECTION_NAME } from "../../core/constants";
import { GLOBAL_FRANCHISE_ID } from "../../core/enums";
import { BaseModelFields } from "../../core/models";
import { UserFranchiseRoleFieldName } from "./UserFranchiseRole.enum";
import { IUserFranchiseRole } from "./UserFranchiseRole.interface";

const UserFranchiseRoleSchemaEntity = new Schema({
  [UserFranchiseRoleFieldName.FRANCHISE_ID]: { type: String, default: GLOBAL_FRANCHISE_ID },
  [UserFranchiseRoleFieldName.ROLE_ID]: { type: String, required: true },
  [UserFranchiseRoleFieldName.USER_ID]: { type: String, required: true },
  [UserFranchiseRoleFieldName.NOTE]: { type: String, required: false },

  ...BaseModelFields,
});

UserFranchiseRoleSchemaEntity.index(
  {
    user_id: 1,
    role_id: 1,
    franchise_id: 1,
  },
  { unique: true },
);

export type UserFranchiseRoleDocument = HydratedDocument<IUserFranchiseRole>;
const UserFranchiseRoleSchema = mongoose.model<UserFranchiseRoleDocument>(
  COLLECTION_NAME.USER_FRANCHISE_ROLE,
  UserFranchiseRoleSchemaEntity,
);
export default UserFranchiseRoleSchema;
