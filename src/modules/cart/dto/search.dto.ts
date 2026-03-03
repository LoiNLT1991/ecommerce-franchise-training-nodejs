import { Type } from "class-transformer";
import { IsDateString, IsEnum, IsMongoId, IsOptional } from "class-validator";
import { BaseSearchItemDto, CartStatus, SearchPaginationRequestModel } from "../../../core";

export class SearchItemDto extends BaseSearchItemDto {
  @IsOptional()
  @IsMongoId()
  public franchise_id?: string;

  @IsOptional()
  @IsMongoId()
  public customer_id?: string;

  @IsOptional()
  @IsMongoId()
  public staff_id?: string;

  @IsOptional()
  @IsEnum(CartStatus)
  public status?: string;

  @IsOptional()
  @IsDateString()
  public start_date?: string;

  @IsOptional()
  @IsDateString()
  public end_date?: string;
}

export class SearchPaginationItemDto extends SearchPaginationRequestModel<SearchItemDto> {
  @Type(() => SearchItemDto)
  public searchCondition!: SearchItemDto;
}
