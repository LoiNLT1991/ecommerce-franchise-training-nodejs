import { Document, Types } from "mongoose";
import { BaseFieldName } from "../../core/enums";
import { IBase } from "../../core/interfaces";

export interface ICategoryFranchise extends Document, IBase {
  [BaseFieldName.CATEGORY_ID]: Types.ObjectId;
  category_name: string;
  [BaseFieldName.FRANCHISE_ID]: Types.ObjectId;
  franchise_name: string;
  [BaseFieldName.DISPLAY_ORDER]: number;
}

export interface ICategoryFranchiseQuery {
  getById(id: string): Promise<ICategoryFranchise | null>;
}