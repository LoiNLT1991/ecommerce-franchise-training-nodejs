import { Document, Types } from "mongoose";
import { BaseFieldName, IBase, IDetailItemOption } from "../../core";
import { ICreateCartItemDto } from "./dto/create.dto";
import { ICartItemDto } from "./dto/item.dto";

export interface ICartItem extends Document, IBase {
  [BaseFieldName.CART_ID]: Types.ObjectId;
  [BaseFieldName.PRODUCT_FRANCHISE_ID]: Types.ObjectId;
  [BaseFieldName.NOTE]?: string;
  [BaseFieldName.QUANTITY]: number;
  [BaseFieldName.PRODUCT_CART_PRICE]: number; // giá hiện tại của product trong giỏ hàng
  [BaseFieldName.DISCOUNT_AMOUNT]: number; // discount theo product
  [BaseFieldName.LINE_TOTAL]: number;
  [BaseFieldName.FINAL_LINE_TOTAL]: number;
  [BaseFieldName.OPTIONS_HASH]: string;
  [BaseFieldName.OPTIONS]: IDetailItemOption[];
}

export interface ICartItemQuery {
  createCartItem(payload: ICreateCartItemDto): Promise<ICartItem>;
  getById(id: string): Promise<ICartItem | null>;
  getItemsByCartId(cartId: Types.ObjectId): Promise<ICartItem[]>;
  findByIdForUpdate(id: string): Promise<ICartItem | null>;
  countItemsByCartId(cartId: Types.ObjectId): Promise<number>;
  getCartItem(payload: ICartItemDto): Promise<ICartItem | null>;
  findDuplicateCartItem(payload: {
    cart_id: Types.ObjectId;
    product_franchise_id: Types.ObjectId;
    options_hash: string;
    exclude_id: Types.ObjectId;
  }): Promise<ICartItem | null>;
}
