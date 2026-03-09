import { Type } from "class-transformer";
import { IsArray, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString, Min, ValidateNested } from "class-validator";

export class UpdateInventoryQuantityDto {
  @IsNotEmpty()
  @IsMongoId()
  product_franchise_id!: string;

  @Type(() => Number)
  @IsNumber()
  change!: number; // + hoặc -

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  alert_threshold!: number;

  @IsOptional()
  @IsString()
  reason?: string; // optional, nhưng nên có để log lại lý do điều chỉnh
}

export class BulkAdjustInventoryDto {
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateInventoryQuantityDto)
  items!: UpdateInventoryQuantityDto[];
}

export class UpdateInventoryThresholdDto {
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  alert_threshold!: number;
}
