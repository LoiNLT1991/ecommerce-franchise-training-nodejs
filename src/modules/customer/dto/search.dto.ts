import { IsOptional, IsString } from "class-validator";
import { BaseSearchItemDto, SearchPaginationRequestModel } from "../../../core";
import { Type } from "class-transformer";

export class SearchItemDto extends BaseSearchItemDto {
  @IsOptional()
  @IsString()
  public keyword?: string; // name, email
}

export class SearchPaginationItemDto extends SearchPaginationRequestModel<SearchItemDto> {
  @Type(() => SearchItemDto)
  public searchCondition!: SearchItemDto;
}
