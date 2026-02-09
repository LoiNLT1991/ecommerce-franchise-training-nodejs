import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export default class CreateUserFranchiseRoleDto {
  @IsNotEmpty()
  @IsString()
  user_id: string;

  @IsNotEmpty()
  @IsString()
  role_id: string;

  @IsOptional()
  @IsString()
  franchise_id?: string | null; // null = GLOBAL

  @IsOptional()
  @IsString()
  note?: string;

  constructor(user_id: string, role_id: string, franchise_id?: string | null, note?: string) {
    this.user_id = user_id;
    this.role_id = role_id;
    this.franchise_id = franchise_id;
    this.note = note;
  }
}
