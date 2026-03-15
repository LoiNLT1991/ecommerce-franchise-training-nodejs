import { NextFunction, Request, Response } from "express";
import {
  AuthenticatedUserRequest,
  BaseCrudController,
  CartStatus,
  CustomerAuthPayload,
  formatResponse,
  HttpStatus,
  OrderType,
  UserAuthPayload,
} from "../../core";
import { ICart } from "./cart.interface";
import { mapItemToResponse } from "./cart.mapper";
import { CartService } from "./cart.service";
import { AddToCartDto, CreateCartDto } from "./dto/create.dto";
import { CartItemDto } from "./dto/item.dto";
import { SearchPaginationItemDto } from "./dto/search.dto";
import { UpdateCartDto } from "./dto/update.dto";

export class CartController extends BaseCrudController<
  ICart,
  CreateCartDto,
  UpdateCartDto,
  SearchPaginationItemDto,
  CartItemDto,
  CartService
> {
  constructor(service: CartService) {
    super(service, mapItemToResponse);
  }

  public addProductToCart = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payload: AddToCartDto = req.body;
      const loggedUser: UserAuthPayload | CustomerAuthPayload = (req as AuthenticatedUserRequest)?.user;
      const item = await this.service.addProductToCart(payload, loggedUser);
      res.status(HttpStatus.Success).json(formatResponse(item));
    } catch (error) {
      next(error);
    }
  };

  public getCartDetail = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const item: ICart = await this.service.getCartDetail(id);
      res.status(HttpStatus.Success).json(formatResponse(item));
    } catch (error) {
      next(error);
    }
  };

  public getCartsByCustomer = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { customerId } = req.params;
      const { status } = req.query;
      const items = await this.service.getCartsByCustomer(customerId, status as CartStatus);
      res.status(HttpStatus.Success).json(formatResponse(items));
    } catch (error) {
      next(error);
    }
  };

  public countCartsByCustomer = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { customerId } = req.params;
      const { status } = req.query;
      const item: number = await this.service.countCartsByCustomer(customerId, status as CartStatus);
      res.status(HttpStatus.Success).json(formatResponse({ count: item }));
    } catch (error) {
      next(error);
    }
  };

  public countCartItemsInCart = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const item: number = await this.service.countCartItemsInCart(id);
      res.status(HttpStatus.Success).json(formatResponse({ count: item }));
    } catch (error) {
      next(error);
    }
  };

  public removeCartItem = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { cartItemId } = req.params;
      const loggedUser: UserAuthPayload | CustomerAuthPayload = (req as AuthenticatedUserRequest)?.user;
      await this.service.removeCartItem(cartItemId, loggedUser);
      res.status(HttpStatus.Success).json(formatResponse(null));
    } catch (error) {
      next(error);
    }
  };

  public updateOptionItem = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const loggedUser: UserAuthPayload | CustomerAuthPayload = (req as AuthenticatedUserRequest)?.user;
      await this.service.updateOptionItem(req.body, loggedUser);
      res.status(HttpStatus.Success).json(formatResponse(null));
    } catch (error) {
      next(error);
    }
  };

  public removeOptionItem = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const loggedUser: UserAuthPayload | CustomerAuthPayload = (req as AuthenticatedUserRequest)?.user;
      await this.service.removeOptionItem(req.body, loggedUser);
      res.status(HttpStatus.Success).json(formatResponse(null));
    } catch (error) {
      next(error);
    }
  };

  public applyVoucher = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const loggedUser: UserAuthPayload | CustomerAuthPayload = (req as AuthenticatedUserRequest)?.user;
      await this.service.applyVoucher(id, req.body, loggedUser);
      res.status(HttpStatus.Success).json(formatResponse(null));
    } catch (error) {
      next(error);
    }
  };

  public removeVoucher = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const loggedUser: UserAuthPayload | CustomerAuthPayload = (req as AuthenticatedUserRequest)?.user;
      await this.service.removeVoucher(id, loggedUser);
      res.status(HttpStatus.Success).json(formatResponse(null));
    } catch (error) {
      next(error);
    }
  };

  public checkoutCart = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const loggedUser: UserAuthPayload | CustomerAuthPayload = (req as AuthenticatedUserRequest)?.user;
      const item: ICart = await this.service.checkoutCart(id, loggedUser);
      res.status(HttpStatus.Success).json(formatResponse(item));
    } catch (error) {
      next(error);
    }
  };

  public cancelCart = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const loggedUser: UserAuthPayload | CustomerAuthPayload = (req as AuthenticatedUserRequest)?.user;
      const item: ICart = await this.service.cancelCart(id, loggedUser);
      res.status(HttpStatus.Success).json(formatResponse(item));
    } catch (error) {
      next(error);
    }
  };
}
