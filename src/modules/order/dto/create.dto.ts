import { Types } from "mongoose";

export class CreateOrderDto {}

export class IAddToOrderDto {
  cart_id!: Types.ObjectId;
  franchise_id!: Types.ObjectId;
  product_franchise_id!: Types.ObjectId;
  customer_id!: Types.ObjectId;
  staff_id!: Types.ObjectId;
  quantity!: number;
  address!: string;
  phone!: string;
  message!: string;
  note!: string;
  options?: IAddOrderItemOptionDto[];
}

export class IAddOrderItemOptionDto {
  product_franchise_id!: Types.ObjectId;
  quantity!: number;
}
