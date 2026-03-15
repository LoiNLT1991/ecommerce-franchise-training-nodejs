import { IsEmpty, IsString } from "class-validator";

export class RefundPaymentDto {
  @IsEmpty()
  @IsString()
  refund_reason!: string;
}
