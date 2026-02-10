import { Transform, Type } from "class-transformer";
import { IsBoolean, IsMongoId, IsOptional } from "class-validator";
import { SearchPaginationRequestModel } from "../../../core/models";

export class SearchItemDto {
  @IsOptional()
  @IsMongoId()
  public category_id?: string;

  @IsOptional()
  @IsMongoId()
  public franchise_id?: string;

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
