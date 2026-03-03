import { IsEnum, IsMongoId, IsOptional, IsString } from "class-validator";
import { ShiftAssignmentStatus } from "../../../core/enums/base.enum";
export class UpdateShiftAssignmentDto {
     @IsOptional()
     @IsMongoId()
     shift_id?:string;

     @IsOptional()
     @IsMongoId()
     user_id?:string;

     @IsOptional()
     @IsString()
     work_date?:string;

     @IsOptional()
     @IsMongoId()
     assigned_by?:string;

     @IsOptional()
     @IsEnum(ShiftAssignmentStatus)
     status?: ShiftAssignmentStatus;
}
