import { PriceType } from "../../core";
import { IVoucherQuery } from "../voucher";
import { ICart, IVoucherResult } from "./cart.interface";

export class CartVoucherService {
  constructor(private readonly voucherQuery: IVoucherQuery) {}

  public async calculateVoucher(cart: ICart, subtotal: number): Promise<IVoucherResult> {
    const { voucher_code, franchise_id } = cart;

    if (!voucher_code) {
      return { discount: 0 };
    }

    const voucher = await this.voucherQuery.getActiveVoucherByCode(voucher_code, franchise_id);

    if (!voucher) {
      return { discount: 0 };
    }

    let discount = 0;

    if (voucher.type === PriceType.PERCENT) {
      discount = (subtotal * voucher.value) / 100;
    }

    if (voucher.type === PriceType.FIXED) {
      discount = voucher.value;
    }

    // optional: tránh giảm quá subtotal
    discount = Math.min(discount, subtotal);

    return {
      voucherId: voucher._id,
      code: voucher.code,
      type: voucher.type,
      value: voucher.value,
      discount,
    };
  }
}
