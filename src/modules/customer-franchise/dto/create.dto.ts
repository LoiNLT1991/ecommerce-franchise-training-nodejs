import { IsMongoId, IsNotEmpty } from "class-validator";
import { Types } from "mongoose";

export default class CreateCustomerFranchiseDto {
  @IsNotEmpty()
  @IsMongoId()
  franchise_id!: string;

  @IsNotEmpty()
  @IsMongoId()
  customer_id!: string;
}

export interface ICreateCustomerFranchiseDto {
  franchise_id: Types.ObjectId;
  customer_id: Types.ObjectId;
}
