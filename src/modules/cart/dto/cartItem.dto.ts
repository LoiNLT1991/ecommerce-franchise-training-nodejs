import { Type } from "class-transformer";
import { IsMongoId, IsNotEmpty, IsNumber, IsOptional, Min, ValidateNested } from "class-validator";
import { AddCartItemOptionDto } from "./create.dto";

export class UpdateCartItemQuantityDto {
  @IsNotEmpty()
  @IsMongoId()
  cart_item_id!: string;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  quantity!: number;
}

export class UpdateCartItemOptionsDto {
  @IsNotEmpty()
  @IsMongoId()
  cart_item_id!: string;

  // optional options
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => AddCartItemOptionDto)
  options?: AddCartItemOptionDto[];
}
