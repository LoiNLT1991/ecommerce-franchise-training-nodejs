import { Transform, Type } from "class-transformer";
import { IsBoolean, IsNotEmptyObject, IsOptional, ValidateNested } from "class-validator";
import "reflect-metadata";
import { PaginationRequestModel, PaginationResponseModel } from "./pagination.model";

export class BaseSearchItemDto {
  @IsOptional()
  @Transform(({ value }) => (value === "" ? undefined : value === "true" ? true : value === "false" ? false : value))
  @IsBoolean()
  is_active?: boolean;

  @IsOptional()
  @Transform(({ value }) => (value === "" ? undefined : value === "true" ? true : value === "false" ? false : value))
  @IsBoolean()
  is_deleted?: boolean;
}

export class SearchPaginationRequestModel<T> {
  constructor(pageInfo: PaginationRequestModel, searchCondition: T) {
    this.pageInfo = pageInfo;
    this.searchCondition = searchCondition;
  }

  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => PaginationRequestModel)
  public pageInfo: PaginationRequestModel;

  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => Object) // Generic type T cannot be used directly here
  public searchCondition: T;
}

export class SearchPaginationResponseModel<T> {
  constructor(pageData: T[] = [], pageInfo: PaginationResponseModel = new PaginationResponseModel()) {
    this.pageData = pageData;
    this.pageInfo = pageInfo;
  }

  public pageData: T[];
  public pageInfo: PaginationResponseModel;
}
