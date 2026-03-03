import { IsMongoId, IsNotEmpty,IsString } from "class-validator";
export class CreateShiftAssignmentDto {
     @IsNotEmpty()
     @IsMongoId()
     shift_id:string;

     @IsNotEmpty()
     @IsMongoId()
     user_id:string;

     @IsNotEmpty()
     @IsString()
     work_date:string;

     @IsNotEmpty()
     @IsMongoId()
     assigned_by:string;

     constructor(shift_id:string,user_id:string,work_date:string,assigned_by:string){
          this.shift_id=shift_id;
          this.user_id=user_id;
          this.work_date=work_date;
          this.assigned_by=assigned_by;
     }
     
}
