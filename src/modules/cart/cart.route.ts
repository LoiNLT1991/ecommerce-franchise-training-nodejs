import { Router } from "express";
import {
  adminAuthMiddleware,
  API_PATH,
  authMiddleware,
  customerAuthMiddleware,
  IRoute,
  validationMiddleware,
} from "../../core";
import { CartController } from "./cart.controller";
import { AddToCartDto } from "./dto/create.dto";
import { RemoveOptionItemDto, UpdateQuantityOptionItemDto } from "./dto/optionItem.dto";
import { UpdateCartDto } from "./dto/update.dto";
import { ApplyVoucherDto } from "./dto/voucher.dto";

export default class CartRoute implements IRoute {
  public path = API_PATH.CART;
  public router = Router();

  constructor(private readonly controller: CartController) {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    /**
     * @swagger
     * tags:
     *   - name: Cart
     *     description: Cart related endpoints
     */

    // GET domain:/api/carts/customer/:customerId - Get carts by customer
    this.router.get(API_PATH.GET_CARTS_BY_CUSTOMER, authMiddleware(), this.controller.getCartsByCustomer);

    // GET domain:/api/carts/customer/:customerId/count-cart - Count cart by customer
    this.router.get(API_PATH.COUNT_CART_BY_CUSTOMER, customerAuthMiddleware(), this.controller.countCartsByCustomer);

    // PUT domain:/api/carts/:id/apply-voucher - Apply voucher for cart
    this.router.put(
      API_PATH.APPLY_VOUCHER,
      authMiddleware(),
      validationMiddleware(ApplyVoucherDto),
      this.controller.applyVoucher,
    );

    // DELETE domain:/api/carts/:id/remove-voucher - Remove voucher for cart
    this.router.delete(API_PATH.REMOVE_VOUCHER, authMiddleware(), this.controller.removeVoucher);

    // GET domain:/api/carts/:id/count-cart-item - Count cart item in cart
    this.router.get(API_PATH.COUNT_CART_ITEM, customerAuthMiddleware(), this.controller.countCartItemsInCart);

    // PUT domain:/api/carts/:id/checkout - Checkout cart
    this.router.put(API_PATH.CHECKOUT_CART, authMiddleware(), this.controller.checkoutCart);

    // PUT domain:/api/carts/:id/cancel - Cancel cart
    this.router.put(API_PATH.CANCEL_CART, authMiddleware(), this.controller.cancelCart);

    // POST domain:/api/carts/items - Add cart, add or update cart item, add option in cart item
    this.router.post(
      API_PATH.CART_ITEM,
      customerAuthMiddleware(),
      validationMiddleware(AddToCartDto),
      this.controller.addProductToCart,
    );

    // POST domain:/api/carts/items/staff - Add cart, add or update cart item, add option in cart item role staff
    this.router.post(
      API_PATH.CART_ITEM_STAFF,
      adminAuthMiddleware(),
      validationMiddleware(AddToCartDto),
      this.controller.addProductToCart,
    );

    // GET domain:/api/carts/:id - Get item
    this.router.get(API_PATH.CART_ID, authMiddleware(), this.controller.getCartDetail);

    // PUT domain:/api/carts/:id - Update item
    this.router.put(
      API_PATH.CART_ID,
      authMiddleware(),
      validationMiddleware(UpdateCartDto),
      this.controller.updateItem,
    );

    // DELETE domain:/api/carts/items/:cartItemId - Delete Cart item
    this.router.delete(API_PATH.CART_ITEM_ID, authMiddleware(), this.controller.removeCartItem);

    // PATCH domain:/api/carts/items/update-option - Update quantity option in cartItem
    this.router.patch(
      API_PATH.UPDATE_OPTION_ITEM,
      authMiddleware(),
      validationMiddleware(UpdateQuantityOptionItemDto),
      this.controller.updateOptionItem,
    );

    // PATCH domain:/api/carts/items/remove-option - Remove option in cartItem
    this.router.patch(
      API_PATH.REMOVE_OPTION_ITEM,
      authMiddleware(),
      validationMiddleware(RemoveOptionItemDto),
      this.controller.removeOptionItem,
    );
  }
}
