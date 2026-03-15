import { generateRandomPassword } from "./helpers";

export const genVoucherCode = (): string => {
  return `VOUCHER_${generateRandomPassword(10).toUpperCase()}`;
};

export const genOrderCode = (): string => {
  return `ORDER_${generateRandomPassword(10).toUpperCase()}`;
};

export const genPaymentCode = (): string => {
  return `PAYMENT_${generateRandomPassword(10).toUpperCase()}`;
};
