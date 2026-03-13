import { Type } from "class-transformer";
import { IsDate, IsEnum, IsNumber, IsOptional, IsString, Min } from "class-validator";
import { PriceType } from "../../../core";

export class UpdatePromotionDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(PriceType)
  type?: PriceType;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  value?: number;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  start_date?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  end_date?: Date;
}
