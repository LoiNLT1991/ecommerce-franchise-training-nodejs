import { IsEnum, IsMongoId, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { PaymentMethod } from "../../../core";

export class ConfirmPaymentDto {
  @IsNotEmpty()
  @IsEnum(PaymentMethod)
  method!: PaymentMethod;

  @IsOptional()
  @IsString()
  providerTxnId?: string;
}
