import { Types } from "mongoose";
import { BaseFieldName, BaseRepository } from "../../core";
import { ICartItem } from "./cart-item.interface";
import CartItemSchema from "./cart-item.model";

export class CartItemRepository extends BaseRepository<ICartItem> {
  constructor() {
    super(CartItemSchema);
  }

  public async getItemsByCartId(cartId: Types.ObjectId): Promise<ICartItem[]> {
    return this.model.find({
      cart_id: cartId,
      is_deleted: false,
    });
  }

  public async countItemsByCartId(cartId: Types.ObjectId): Promise<number> {
    return this.model.countDocuments({
      cart_id: cartId,
      is_deleted: false,
    });
  }

  public async bulkUpdateTotals(
    items: Pick<ICartItem, "_id" | BaseFieldName.LINE_TOTAL | BaseFieldName.FINAL_LINE_TOTAL>[],
  ): Promise<void> {
    if (!items.length) return;

    await this.model.bulkWrite(
      items.map((item) => ({
        updateOne: {
          filter: { _id: item._id },
          update: {
            $set: {
              [BaseFieldName.LINE_TOTAL]: item[BaseFieldName.LINE_TOTAL],
              [BaseFieldName.FINAL_LINE_TOTAL]: item[BaseFieldName.FINAL_LINE_TOTAL],
            },
          },
        },
      })),
    );
  }
}
