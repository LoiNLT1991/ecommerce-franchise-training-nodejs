import { Document } from "mongoose";
import { BaseFieldName } from "../../core/enums";
import { IBase } from "../../core/interfaces";

export interface IProductFranchise extends Document, IBase {
  [BaseFieldName.PRODUCT_ID]: string;
  product_name: string;
  [BaseFieldName.FRANCHISE_ID]: string;
  franchise_name: string;
  [BaseFieldName.SIZE]: string;
  [BaseFieldName.PRICE_BASE]: number;
}

export interface IProductFranchisePopulated extends Omit<IProductFranchise, "product_id" | "franchise_id"> {
  product_id: {
    _id: string;
    name: string;
  };
  franchise_id: {
    _id: string;
    name: string;
  };
}
