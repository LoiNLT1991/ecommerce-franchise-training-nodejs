import { IsEnum, IsMongoId, IsOptional } from "class-validator";
import { DeliveryStatus } from "../../../core";

export class SearchItemDto {
  @IsOptional()
  @IsMongoId()
  public franchise_id?: string;

  @IsOptional()
  @IsMongoId()
  public staff_id?: string;

  @IsOptional()
  @IsMongoId()
  public customer_id?: string;

  @IsOptional()
  @IsEnum(DeliveryStatus)
  public status?: DeliveryStatus;
}
