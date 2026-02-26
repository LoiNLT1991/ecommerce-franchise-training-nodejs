import { IsMongoId, IsNumber, IsOptional, IsString } from "class-validator";
import { BaseSearchItemDto, SearchPaginationRequestModel } from "../../../core";
import { Type } from "class-transformer";

export class SearchItemDto extends BaseSearchItemDto {
  @IsOptional()
  @IsMongoId()
  public franchise_id?: string;

  @IsOptional()
  @IsMongoId()
  public customer_id?: string;

  @IsOptional()
  @IsString()
  public loyalty_tier?: string;

  @IsOptional()
  @IsNumber()
  public loyalty_points?: number;

  @IsOptional()
  @IsNumber()
  public total_earned_points?: number;
}

export class SearchPaginationItemDto extends SearchPaginationRequestModel<SearchItemDto> {
  @Type(() => SearchItemDto)
  public searchCondition!: SearchItemDto;
}
