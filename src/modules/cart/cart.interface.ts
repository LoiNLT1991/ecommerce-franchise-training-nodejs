import { Types } from "mongoose";
import { BaseFieldName, IBase } from "../../core";

export interface ICart extends Document, IBase {
  [BaseFieldName.CUSTOMER_ID]: Types.ObjectId;
  [BaseFieldName.STAFF_ID]?: Types.ObjectId;
  staff_name?: string;
  [BaseFieldName.STATUS]: string;
}
