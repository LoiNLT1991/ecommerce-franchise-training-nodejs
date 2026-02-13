import { Document, Types } from "mongoose";
import { IBase } from "../../core/interfaces";
import { BaseFieldName } from "../../core/enums/base.enum";

export interface IProductCategoryFranchise extends Document, IBase {
  [BaseFieldName.CATEGORY_FRANCHISE_ID]: Types.ObjectId;
  [BaseFieldName.PRODUCT_FRANCHISE_ID]: Types.ObjectId;
  [BaseFieldName.DISPLAY_ORDER]: number;

  [BaseFieldName.FRANCHISE_ID]: string;
  franchise_name: string;
  [BaseFieldName.CATEGORY_ID]: string;
  category_name: string;
  [BaseFieldName.PRODUCT_ID]: string;
  product_name: string;
  [BaseFieldName.SIZE]: string;
  [BaseFieldName.PRICE_BASE]: number;
}

export interface IProductCategoryFranchiseQuery {
  getById(id: string): Promise<IProductCategoryFranchise | null>;
}
