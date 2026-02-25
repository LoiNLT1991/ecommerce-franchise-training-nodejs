import mongoose, { HydratedDocument, Schema } from "mongoose";
import { BaseFieldName } from "../../core";
import { COLLECTION_NAME } from "../../core/constants";
import { BaseModelFields } from "../../core/models";
import { IUser } from "./user.interface";

const UserSchemaEntity = new Schema({
  [BaseFieldName.EMAIL]: { type: String, unique: true, index: true },
  [BaseFieldName.PASSWORD]: { type: String },
  [BaseFieldName.NAME]: { type: String, default: "" },
  [BaseFieldName.PHONE]: { type: String, default: "" },
  [BaseFieldName.AVATAR_URL]: { type: String, default: "" },

  [BaseFieldName.IS_VERIFIED]: { type: Boolean, default: false },
  [BaseFieldName.VERIFICATION_TOKEN]: { type: String },
  [BaseFieldName.VERIFICATION_TOKEN_EXPIRES]: { type: Date },
  [BaseFieldName.TOKEN_VERSION]: { type: Number, default: 0 },

  [BaseFieldName.LAST_RESET_PASSWORD_AT]: { type: Date, default: Date.now },

  ...BaseModelFields,
});

export type UserDocument = HydratedDocument<IUser>;
const UserSchema = mongoose.model<UserDocument>(COLLECTION_NAME.USER, UserSchemaEntity);
export default UserSchema;
