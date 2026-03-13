import { PriceType } from "../../core";
import { ICartItem } from "../cart-item";
import { IPromotion, IPromotionQuery } from "../promotion";
import { ICart, IPromotionResult } from "./cart.interface";

export class CartPromotionService {
  constructor(private readonly promotionQuery: IPromotionQuery) {}

  public async calculatePromotion(cart: ICart, items: ICartItem[]): Promise<IPromotionResult> {
    const promotions = await this.promotionQuery.getActivePromotionsByFranchiseId(cart.franchise_id);

    let bestDiscount = 0;
    let bestPromotion: IPromotion | null = null;

    for (const promotion of promotions) {
      let currentDiscount = 0;

      // cart-level promotion
      if (!promotion.product_franchise_id) {
        if (promotion.type === PriceType.PERCENT) {
          currentDiscount = (cart.subtotal_amount * promotion.value) / 100;
        }

        if (promotion.type === PriceType.FIXED) {
          currentDiscount = promotion.value;
        }
      } else {
        // item-level promotion
        for (const item of items) {
          if (item.product_franchise_id?.toString() === promotion.product_franchise_id.toString()) {
            if (promotion.type === PriceType.PERCENT) {
              currentDiscount += (item.line_total * promotion.value) / 100;
            }

            if (promotion.type === PriceType.FIXED) {
              currentDiscount += promotion.value * item.quantity;
            }
          }
        }
      }

      if (currentDiscount > bestDiscount) {
        bestDiscount = currentDiscount;
        bestPromotion = promotion;
      }
    }

    return {
      promotionId: bestPromotion?._id,
      type: bestPromotion?.type,
      value: bestPromotion?.value,
      discount: bestDiscount,
    };
  }
}
