import { IsMongoId, IsNotEmpty } from "class-validator";

export default class UpdateCustomerFranchiseDto {
  @IsNotEmpty()
  @IsMongoId()
  franchise_id!: string;

  @IsNotEmpty()
  @IsMongoId()
  customer_id!: string;
}