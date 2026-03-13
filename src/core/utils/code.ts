import { generateRandomPassword } from "./helpers";

export const genVoucherCode = (): string => {
  return `VOUCHER_${generateRandomPassword(10).toUpperCase()}`;
};
