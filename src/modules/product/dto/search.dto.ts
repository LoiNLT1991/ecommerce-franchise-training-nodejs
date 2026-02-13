import { Transform, Type } from "class-transformer";
import { IsNumber, IsOptional, IsString } from "class-validator";
import { BaseSearchItemDto, SearchPaginationRequestModel } from "../../../core/models";

export class SearchItemDto extends BaseSearchItemDto {
  @IsOptional()
  @IsString()
  public keyword?: string; // SKU, name

  @IsOptional()
  @Transform(({ value }) => {
    if (value === "" || value === null || value === undefined) {
      return undefined;
    }
    return Number(value);
  })
  @IsNumber()
  min_price?: number;

  @IsOptional()
  @Transform(({ value }) => {
    if (value === "" || value === null || value === undefined) {
      return undefined;
    }
    return Number(value);
  })
  @IsNumber()
  max_price?: number;
}

export class SearchPaginationItemDto extends SearchPaginationRequestModel<SearchItemDto> {
  @Type(() => SearchItemDto)
  public searchCondition!: SearchItemDto;
}
