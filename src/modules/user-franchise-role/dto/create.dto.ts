import { IsMongoId, IsNotEmpty, IsOptional, IsString } from "class-validator";

export default class CreateUserFranchiseRoleDto {
  @IsNotEmpty()
  @IsMongoId()
  user_id: string;

  @IsNotEmpty()
  @IsMongoId()
  role_id: string;

  @IsOptional()
  @IsMongoId()
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
