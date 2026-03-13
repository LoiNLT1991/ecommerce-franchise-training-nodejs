import { Types } from "mongoose";

export class CartItemItemDto {}

export interface ICartItemDto {
  cart_id: Types.ObjectId;
  product_franchise_id: Types.ObjectId;
  note?: string;
  options_hash: string;
}
