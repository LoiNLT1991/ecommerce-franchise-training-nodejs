import { IsDateString, IsEnum, IsMongoId, IsOptional, IsString } from "class-validator";
import { BaseSearchItemDto, OrderStatus, SearchPaginationRequestModel } from "../../../core";
import { Type } from "class-transformer";

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
  @IsString()
  public order_code?: string;

  @IsOptional()
  @IsEnum(OrderStatus)
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
