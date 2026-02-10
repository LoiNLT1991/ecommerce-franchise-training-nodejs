import { Transform, Type } from "class-transformer";
import { IsNumber, IsOptional, IsString, MaxLength, Min } from "class-validator";
import { BaseSearchItemDto, SearchPaginationRequestModel } from "../../../core/models";

export class SearchItemDto extends BaseSearchItemDto {
  @IsOptional()
  @Transform(({ value }) => (value === "" ? undefined : value))
  @IsString()
  product_id?: string;

  @IsOptional()
  @Transform(({ value }) => (value === "" ? undefined : value))
  @IsString()
  franchise_id?: string;

  @IsOptional()
  @Transform(({ value }) => {
    if (value === undefined || value === null || value === "") {
      return undefined;
    }
    return String(value).trim().toUpperCase();
  })
  @IsString()
  @MaxLength(20)
  size?: string;

  @IsOptional()
  @Transform(({ value }) => {
    if (value === "" || value === null || value === undefined) {
      return undefined;
    }

    const num = Number(value);
    return Number.isFinite(num) ? num : undefined;
  })
  @IsNumber()
  @Min(0)
  price_from?: number;

  @IsOptional()
  @Transform(({ value }) => {
    if (value === "" || value === null || value === undefined) {
      return undefined;
    }

    const num = Number(value);
    return Number.isFinite(num) ? num : undefined;
  })
  @IsNumber()
  @Min(0)
  price_to?: number;
}

export class SearchPaginationItemDto extends SearchPaginationRequestModel<SearchItemDto> {
  @Type(() => SearchItemDto)
  public searchCondition!: SearchItemDto;
}
