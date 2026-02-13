import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class UpdateDisplayOrderItemDto {
  @IsNotEmpty()
  @IsString()
  category_franchise_id!: string;

  @IsNotEmpty()
  @IsString()
  item_id!: string;

  @IsNotEmpty()
  @IsNumber()
  new_position!: number;
}
