import mongoose, { HydratedDocument, Schema } from "mongoose";
import { BaseFieldName, BaseModelFields, COLLECTION_NAME } from "../../core";
import { ICustomer } from "./customer.interface";

const CustomerSchemaEntity = new Schema({
  [BaseFieldName.EMAIL]: { type: String, unique: true, index: true },
  [BaseFieldName.PHONE]: { type: String, default: "" },
  [BaseFieldName.PASSWORD]: { type: String },
  [BaseFieldName.NAME]: { type: String, default: "" },
  [BaseFieldName.AVATAR_URL]: { type: String, default: "" },
  [BaseFieldName.ADDRESS]: { type: String, default: "" },

  [BaseFieldName.IS_VERIFIED]: { type: Boolean, default: false },
  [BaseFieldName.VERIFICATION_TOKEN]: { type: String },
  [BaseFieldName.VERIFICATION_TOKEN_EXPIRES]: { type: Date },
  [BaseFieldName.TOKEN_VERSION]: { type: Number, default: 0 },

  [BaseFieldName.LAST_RESET_PASSWORD_AT]: { type: Date, default: Date.now },

  ...BaseModelFields,
});

export type CustomerDocument = HydratedDocument<ICustomer>;
const CustomerSchema = mongoose.model<CustomerDocument>(COLLECTION_NAME.CUSTOMER, CustomerSchemaEntity);
export default CustomerSchema;