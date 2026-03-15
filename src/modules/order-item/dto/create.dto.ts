import { Types } from "mongoose";

export class CreateOrderItemDto {}
export interface ICreateOrderItemDto {
  order_id: Types.ObjectId;
  product_franchise_id: Types.ObjectId;
  quantity: number;
  price_snapshot: number;
  note?: string;

  options_hash: string;
  options?: ICartItemOptionDto[];

  discount_amount?: number;
  line_total?: number;
  final_line_total?: number;
}

export interface ICartItemOptionDto {
  product_franchise_id: Types.ObjectId;
  quantity: number;
  price_snapshot: number;
  discount_amount?: number;
  final_price?: number;
}
