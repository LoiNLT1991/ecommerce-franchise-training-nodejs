import { Document, Types } from "mongoose";
import { BaseFieldName } from "../../core/enums";
import { IBase } from "../../core/interfaces";
import { PublicCategoryFranchiseItemDto } from "./dto/item.dto";

export interface ICategoryFranchise extends Document, IBase {
  [BaseFieldName.CATEGORY_ID]: Types.ObjectId;
  category_code: string;
  category_name: string;
  [BaseFieldName.FRANCHISE_ID]: Types.ObjectId;
  franchise_code: string;
  franchise_name: string;
  [BaseFieldName.DISPLAY_ORDER]: number;
}

export interface ICategoryFranchiseQuery {
  getById(id: string): Promise<ICategoryFranchise | null>;
  getByFranchiseIdAndCategoryId(franchiseId: string, categoryId: string): Promise<ICategoryFranchise | null>;
  getPublicCategoriesByFranchiseId(franchiseId: string): Promise<PublicCategoryFranchiseItemDto[]>;
}
