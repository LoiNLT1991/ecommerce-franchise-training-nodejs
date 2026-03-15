import { NextFunction, Request, Response } from "express";
import { formatResponse, HttpStatus, OrderStatus } from "../../core";
import { IOrder } from "./order.interface";
import { OrderService } from "./order.service";

export class OrderController {
  constructor(private readonly service: OrderService) {}

  public getOrderDetail = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const item: IOrder = await this.service.getOrderDetail(id);
      res.status(HttpStatus.Success).json(formatResponse(item));
    } catch (error) {
      next(error);
    }
  };

  public getOrderDetailByCode = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { code } = req.query;
      const item: IOrder = await this.service.getOrderDetailByCode(code as string);
      res.status(HttpStatus.Success).json(formatResponse(item));
    } catch (error) {
      next(error);
    }
  };

  public getOrderByCartId = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { cartId } = req.params;
      const item: IOrder = await this.service.getOrderByCartId(cartId);
      res.status(HttpStatus.Success).json(formatResponse(item));
    } catch (error) {
      next(error);
    }
  };

  public getOrdersByCustomerId = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { customerId } = req.params;
      const { status } = req.query;
      const items = await this.service.getOrdersByCustomerId(customerId, status as OrderStatus);
      res.status(HttpStatus.Success).json(formatResponse(items));
    } catch (error) {
      next(error);
    }
  };

  public getOrdersForStaff = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { franchiseId } = req.params;
      const { status } = req.query;
      const items = await this.service.getOrdersForStaff(franchiseId, status as OrderStatus);
      res.status(HttpStatus.Success).json(formatResponse(items));
    } catch (error) {
      next(error);
    }
  };
}
