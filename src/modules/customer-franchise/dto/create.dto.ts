import { IsMongoId, IsNotEmpty } from "class-validator";

export default class CreateCustomerFranchiseDto {
  @IsNotEmpty()
  @IsMongoId()
  franchise_id!: string;

  @IsNotEmpty()
  @IsMongoId()
  customer_id!: string;
}