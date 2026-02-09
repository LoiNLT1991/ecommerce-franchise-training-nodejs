import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsString } from "class-validator";
import { SearchPaginationRequestModel } from "../../../core/models";
import { SearchItemDto } from "../../franchise/dto/search.dto";
import { AuditAction } from "../audit-log.enum";

export class SearchAuditLogDto {
  @IsOptional()
  @IsString()
  keyword?: string; // entity_type, note

  @IsOptional()
  action?: AuditAction;

  @IsOptional()
  @IsString()
  changed_by?: string;

  @IsOptional()
  @IsString()
  from_date?: string; // ISO

  @IsOptional()
  @IsString()
  to_date?: string; // ISO
}

export class SearchPaginationItemDto extends SearchPaginationRequestModel<SearchItemDto> {
  @Type(() => SearchItemDto)
  public searchCondition!: SearchItemDto;
}

export class SearchAuditLogByEntityDto {
  @IsOptional()
  @IsString()
  entity_id?: string;
  
  @IsOptional()
  @IsNumber()
  limit?: number;
}
