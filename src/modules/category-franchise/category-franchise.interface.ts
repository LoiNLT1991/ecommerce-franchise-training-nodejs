import { Document } from "mongoose";
import { IBase } from "../../core/interfaces";
import { BaseFieldName } from "../../core/enums";

export interface ICategoryFranchise extends Document, IBase {
  [BaseFieldName.CATEGORY_ID]: string;
  [BaseFieldName.FRANCHISE_ID]: string;
  [BaseFieldName.DISPLAY_ORDER]: number;
}

export interface ICategoryFranchisePopulated extends Omit<ICategoryFranchise, "category_id" | "franchise_id"> {
  category_id: {
    _id: string;
    name: string;
  };
  franchise_id: {
    _id: string;
    name: string;
  };
}
