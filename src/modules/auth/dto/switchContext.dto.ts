import { IsOptional, IsString } from "class-validator";

export class SwitchContextDto {
  @IsOptional()
  @IsString()
  public franchise_id?: string | null;
}
