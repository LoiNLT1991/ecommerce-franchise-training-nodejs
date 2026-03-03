import mongoose, { HydratedDocument, Schema } from "mongoose";
import { BASE_MODEL_FIELDS, BaseFieldName, COLLECTION_NAME } from "../../core";
import { IUserFranchiseRole } from "./user-franchise-role.interface";

const UserFranchiseRoleSchemaEntity = new Schema(
  {
    [BaseFieldName.FRANCHISE_ID]: {
      type: mongoose.Schema.Types.ObjectId,
      ref: COLLECTION_NAME.FRANCHISE,
      required: false,
      index: true,
    },

    [BaseFieldName.ROLE_ID]: {
      type: mongoose.Schema.Types.ObjectId,
      ref: COLLECTION_NAME.ROLE,
      required: true,
      index: true,
    },

    [BaseFieldName.USER_ID]: {
      type: mongoose.Schema.Types.ObjectId,
      ref: COLLECTION_NAME.USER,
      required: true,
      index: true,
    },

    [BaseFieldName.NOTE]: {
      type: String,
      required: false,
    },

    ...BASE_MODEL_FIELDS,
  },
  { timestamps: true },
);

UserFranchiseRoleSchemaEntity.index(
  {
    [BaseFieldName.USER_ID]: 1,
    [BaseFieldName.ROLE_ID]: 1,
  },
  {
    unique: true,
    partialFilterExpression: {
      franchise_id: { $exists: false },
      is_deleted: false,
    },
  },
);

UserFranchiseRoleSchemaEntity.index(
  {
    [BaseFieldName.USER_ID]: 1,
    [BaseFieldName.ROLE_ID]: 1,
    [BaseFieldName.FRANCHISE_ID]: 1,
  },
  {
    unique: true,
    partialFilterExpression: { is_deleted: false },
  },
);

export type UserFranchiseRoleDocument = HydratedDocument<IUserFranchiseRole>;
const UserFranchiseRoleSchema = mongoose.model<UserFranchiseRoleDocument>(
  COLLECTION_NAME.USER_FRANCHISE_ROLE,
  UserFranchiseRoleSchemaEntity,
);
export default UserFranchiseRoleSchema;
