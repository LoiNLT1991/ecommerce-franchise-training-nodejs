import { Type } from "class-transformer";
import { IsMongoId, IsOptional } from "class-validator";
import { BaseSearchItemDto, SearchPaginationRequestModel } from "../../../core/models";

export class SearchItemDto extends BaseSearchItemDto {
  @IsOptional()
  @IsMongoId()
  public franchise_id?: string;

  @IsOptional()
  @IsMongoId()
  public category_id?: string;
}

export class SearchPaginationItemDto extends SearchPaginationRequestModel<SearchItemDto> {
  @Type(() => SearchItemDto)
  public searchCondition!: SearchItemDto;
}
