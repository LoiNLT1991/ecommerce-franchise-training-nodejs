import { Document, Types } from "mongoose";
import { BaseFieldName, IBase } from "../../core";
import CreateCustomerFranchiseDto from "./dto/create.dto";

export interface ICustomerFranchise extends Document, IBase {
  [BaseFieldName.CUSTOMER_ID]: Types.ObjectId;
  [BaseFieldName.FRANCHISE_ID]: Types.ObjectId;
  [BaseFieldName.LOYALTY_POINTS]: number; // default 0
  [BaseFieldName.TOTAL_EARNED_POINTS]: number; // default 0
  [BaseFieldName.LOYALTY_TIER]: string; // BRONZE, SILVER, GOLD, PLATINUM
  [BaseFieldName.FIRST_ORDER_DATE]?: Date;
  [BaseFieldName.LAST_ORDER_DATE]?: Date;

  customer_name: string;
  customer_email: string;
  customer_phone: string;
  franchise_code: string;
  franchise_name: string;
}

export interface ICustomerFranchiseQuery {
  createItem(payload: CreateCustomerFranchiseDto, loggedUserId: string): Promise<ICustomerFranchise | null>;
}
