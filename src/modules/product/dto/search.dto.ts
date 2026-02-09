import { Transform, Type } from "class-transformer";
import { IsBoolean, IsNumber, IsOptional, IsString } from "class-validator";
import { SearchPaginationRequestModel } from "../../../core/models";

export class SearchItemDto {
  @IsOptional()
  @IsString()
  public keyword?: string; // SKU, name

  @IsOptional()
  @Transform(({ value }) => (value === "" ? undefined : Number(value)))
  @IsNumber()
  public min_price?: number;

  @IsOptional()
  @Transform(({ value }) => (value === "" ? undefined : Number(value)))
  @IsNumber()
  public max_price?: number;

  @IsOptional()
  @Transform(({ value }) => (value === "" ? undefined : value === "true" ? true : value === "false" ? false : value))
  @IsBoolean()
  is_active?: boolean;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => (value === "" ? undefined : value === "true" ? true : value === "false" ? false : value))
  public is_deleted?: boolean;
}

export class SearchPaginationItemDto extends SearchPaginationRequestModel<SearchItemDto> {
  @Type(() => SearchItemDto)
  public searchCondition!: SearchItemDto;
}
