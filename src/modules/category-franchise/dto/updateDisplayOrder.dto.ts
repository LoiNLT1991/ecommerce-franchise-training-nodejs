import { IsNumber } from "class-validator";

export class UpdateDisplayOrderItemDto {
  @IsNumber()
  display_order!: number;
}
