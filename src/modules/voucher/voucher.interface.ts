import { ClientSession, Document, Types } from "mongoose";
import { BaseFieldName, PriceType } from "../../core/enums";
import { IBase } from "../../core/interfaces";
import { VoucherFieldName } from "./voucher.enum";

export interface IVoucher extends Document, IBase {
  [VoucherFieldName.CODE]: string;
  [VoucherFieldName.NAME]: string;
  [VoucherFieldName.DESCRIPTION]: string;
  [BaseFieldName.FRANCHISE_ID]: Types.ObjectId;
  franchise_name: string;
  [VoucherFieldName.PRODUCT_FRANCHISE_ID]?: Types.ObjectId;
  product_id: string;
  product_name: string;
  [VoucherFieldName.TYPE]: PriceType;
  [VoucherFieldName.VALUE]: number;
  [VoucherFieldName.QUOTA_TOTAL]: number;
  [VoucherFieldName.QUOTA_USED]: number;
  [VoucherFieldName.START_DATE]: Date;
  [VoucherFieldName.END_DATE]: Date;
  [BaseFieldName.CREATED_BY]: Types.ObjectId;
  [BaseFieldName.IS_ACTIVE]: boolean;
  [BaseFieldName.IS_DELETED]: boolean;
}

export interface IVoucherQuery {
  getById(id: string): Promise<IVoucher | null>;
  getActiveVoucherByCode(code: string, franchiseId: Types.ObjectId): Promise<IVoucher | null>;
  decreaseQuotaById(id: Types.ObjectId, session?: ClientSession): Promise<boolean>;
  increaseQuotaById(id: Types.ObjectId, session?: ClientSession): Promise<boolean>;
}
