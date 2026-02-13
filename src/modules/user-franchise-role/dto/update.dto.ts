import { IsMongoId, IsNotEmpty, IsOptional, IsString } from "class-validator";

export default class UpdateUserFranchiseRoleDto {
  @IsNotEmpty()
  @IsMongoId()
  role_id: string;

  @IsOptional()
  @IsMongoId()
  note?: string;

  constructor(role_id: string, note?: string) {
    this.role_id = role_id;
    this.note = note;
  }
}
