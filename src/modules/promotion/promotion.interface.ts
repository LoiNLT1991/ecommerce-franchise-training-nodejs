import { Document, Types } from "mongoose";
import { BaseFieldName, PriceType } from "../../core/enums";
import { IBase } from "../../core/interfaces";
import { PromotionFieldName } from "./promotion.enum";

export interface IPromotion extends Document, IBase {
  [BaseFieldName.NAME]: string;
  [BaseFieldName.FRANCHISE_ID]: Types.ObjectId;
  franchise_name?: string;
  [PromotionFieldName.PRODUCT_FRANCHISE_ID]?: Types.ObjectId;
  product_id?: string;
  product_name?: string;
  [PromotionFieldName.TYPE]: PriceType;
  [PromotionFieldName.VALUE]: number;
  [PromotionFieldName.START_DATE]: Date;
  [PromotionFieldName.END_DATE]: Date;
  [PromotionFieldName.CREATED_BY]: Types.ObjectId;
  [BaseFieldName.IS_ACTIVE]: boolean;
  [BaseFieldName.IS_DELETED]: boolean;
}

export interface IPromotionQuery {
  getById(id: string): Promise<IPromotion | null>;
  getActivePromotionsByFranchiseId(franchiseId: Types.ObjectId): Promise<IPromotion[]>;
}
