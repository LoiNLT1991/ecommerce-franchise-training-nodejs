import mongoose, { HydratedDocument, Schema } from "mongoose";
import { COLLECTION_NAME } from "../../core/constants";
import { BaseModelFields } from "../../core/models";
import { UserFieldName } from "./user.enum";
import { IUser } from "./user.interface";
import { BaseFieldName } from "../../core";

const UserSchemaEntity = new Schema({
  [BaseFieldName.EMAIL]: { type: String, unique: true, index: true },
  [BaseFieldName.PASSWORD]: { type: String },
  [BaseFieldName.NAME]: { type: String, default: "" },
  [BaseFieldName.PHONE]: { type: String, default: "" },
  [BaseFieldName.AVATAR_URL]: { type: String, default: "" },

  [UserFieldName.IS_VERIFIED]: { type: Boolean, default: false },
  [UserFieldName.VERIFICATION_TOKEN]: { type: String },
  [UserFieldName.VERIFICATION_TOKEN_EXPIRES]: { type: Date },
  [UserFieldName.TOKEN_VERSION]: { type: Number, default: 0 },

  [UserFieldName.LAST_RESET_PASSWORD_AT]: { type: Date, default: Date.now },

  ...BaseModelFields,
});

export type UserDocument = HydratedDocument<IUser>;
const UserSchema = mongoose.model<UserDocument>(COLLECTION_NAME.USER, UserSchemaEntity);
export default UserSchema;
