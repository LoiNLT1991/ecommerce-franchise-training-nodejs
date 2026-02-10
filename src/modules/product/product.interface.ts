import { Document } from "mongoose";
import { BaseFieldName } from "../../core/enums";
import { IBase } from "../../core/interfaces";
import { ProductFieldName } from "./product.enum";

export interface IProduct extends Document, IBase {
  [ProductFieldName.SKU]: string;
  [BaseFieldName.NAME]: string;
  [BaseFieldName.DESCRIPTION]: string;
  [ProductFieldName.CONTENT]: string;
  [ProductFieldName.IMAGE_URL]: string;
  [ProductFieldName.IMAGES_URL]?: string[];
  [ProductFieldName.MIN_PRICE]: number;
  [ProductFieldName.MAX_PRICE]: number;
}

export interface IProductQuery {
  getById(id: string): Promise<IProduct | null>;
}
