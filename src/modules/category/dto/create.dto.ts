import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export default class CreateCategoryDto {
  @IsNotEmpty()
  @IsString()
  code: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  parent_id?: string;

  @IsOptional()
  @IsNumber()
  sort_order?: number;

  constructor(code: string, name: string, description?: string, parent_id?: string, sort_order?: number) {
    this.code = code;
    this.name = name;
    this.description = description;
    this.parent_id = parent_id;
    this.sort_order = sort_order;
  }
}
