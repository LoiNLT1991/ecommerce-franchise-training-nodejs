import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export default class UpdateUserFranchiseRoleDto {
  @IsNotEmpty()
  @IsString()
  role_id: string;

  @IsOptional()
  @IsString()
  note?: string;

  constructor(role_id: string, note?: string) {
    this.role_id = role_id;
    this.note = note;
  }
}
