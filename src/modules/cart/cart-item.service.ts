import { CustomerAuthPayload, HttpException, HttpStatus, UserAuthPayload } from "../../core";
import { AuditAction, AuditEntityType, IAuditLogger } from "../audit-log";
import { ICartItem, ICartItemQuery } from "../cart-item";
import { CartHelper } from "./cart.helper";
import { UpdateCartItemQuantityDto } from "./dto/cartItem.dto";

export class CartItemService {
  constructor(
    private readonly auditLogger: IAuditLogger,
    private readonly cartHelper: CartHelper,
    private readonly cartItemQuery: ICartItemQuery,
  ) {}

  public async updateCartItemQuantity(
    payload: UpdateCartItemQuantityDto,
    loggedUser: UserAuthPayload | CustomerAuthPayload,
  ): Promise<ICartItem> {
    const { cart_item_id, quantity } = payload;

    /**
     * STEP 1 — Validate quantity
     */
    if (quantity <= 0) {
      throw new HttpException(HttpStatus.BadRequest, "Quantity must be > 0");
    }

    /**
     * STEP 2 — Get cart item
     */
    const item = await this.cartItemQuery.findByIdForUpdate(cart_item_id);

    if (!item) {
      throw new HttpException(HttpStatus.BadRequest, "Cart item not found");
    }

    /**
     * STEP 3 — Snapshot before update
     */
    const oldSnapshot = this.cartHelper.buildCartItemSnapshot(item);

    /**
     * STEP 4 — Check duplicate (same product + same options_hash)
     */
    const duplicateItem = await this.cartItemQuery.findDuplicateCartItem({
      cart_id: item.cart_id,
      product_franchise_id: item.product_franchise_id,
      options_hash: item.options_hash,
      exclude_id: item._id,
    });

    let finalItem = item;

    /**
     * STEP 5 — Merge nếu duplicate tồn tại
     */
    if (duplicateItem) {
      duplicateItem.quantity += quantity;

      await duplicateItem.save();
      await item.deleteOne();

      finalItem = duplicateItem;
    } else {
      /**
       * Update quantity trực tiếp
       */
      item.quantity = quantity;

      await item.save();

      finalItem = item;
    }

    /**
     * STEP 6 — Snapshot after update
     */
    const newSnapshot = this.cartHelper.buildCartItemSnapshot(finalItem);

    /**
     * STEP 7 — Audit log
     */
    await this.auditLogger.log({
      entityType: AuditEntityType.CART,
      entityId: String(finalItem._id),
      action: AuditAction.UPDATE_CART_ITEM_QUANTITY,
      oldData: oldSnapshot,
      newData: newSnapshot,
      changedBy: loggedUser.id,
    });

    return finalItem;
  }

  public async removeCartItem(cartItemId: string, loggedUser: UserAuthPayload | CustomerAuthPayload): Promise<void> {
    const item = await this.cartItemQuery.findByIdForUpdate(cartItemId);
    if (!item) throw new Error("Cart item not found");
    const oldSnapshot = this.cartHelper.buildCartItemSnapshot(item);
    await item.deleteOne();
    await this.auditLogger.log({
      entityType: AuditEntityType.CART,
      entityId: cartItemId,
      action: AuditAction.REMOVE_CART_ITEM,
      oldData: oldSnapshot,
      newData: undefined,
      changedBy: loggedUser.id,
    });
  }
}
