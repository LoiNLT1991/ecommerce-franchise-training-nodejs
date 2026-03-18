import { NextFunction, Request, Response } from "express";
import { formatResponse, HttpStatus } from "../../core";
import { IDelivery } from "./delivery.interface";
import { DeliveryService } from "./delivery.service";

export class DeliveryController {
  constructor(private readonly service: DeliveryService) {}

  public getItemDetail = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const item: IDelivery = await this.service.getDetail(id);
      res.status(HttpStatus.Success).json(formatResponse(item));
    } catch (error) {
      next(error);
    }
  };

  public getItemByOrderId = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { orderId } = req.params;
      const item: IDelivery = await this.service.getItemByOrderId(orderId);
      res.status(HttpStatus.Success).json(formatResponse(item));
    } catch (error) {
      next(error);
    }
  };

  public searchDeliveries = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const items: IDelivery[] = await this.service.searchDeliveries(req.body);
      res.status(HttpStatus.Success).json(formatResponse(items));
    } catch (error) {
      next(error);
    }
  };
}
