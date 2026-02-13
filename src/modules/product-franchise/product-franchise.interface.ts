import { Document, Types } from "mongoose";
import { BaseFieldName } from "../../core/enums";
import { IBase } from "../../core/interfaces";

export interface IProductFranchise extends Document, IBase {
  [BaseFieldName.PRODUCT_ID]: Types.ObjectId;
  product_name: string;
  [BaseFieldName.FRANCHISE_ID]: Types.ObjectId;
  franchise_name: string;
  [BaseFieldName.SIZE]?: string | null;
  [BaseFieldName.PRICE_BASE]: number;
}

export interface IProductFranchiseQuery {
  getById(id: string): Promise<IProductFranchise | null>;
}
