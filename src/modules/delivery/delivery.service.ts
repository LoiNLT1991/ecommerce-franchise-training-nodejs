import { ClientSession, Types } from "mongoose";
import { DeliveryStatus, HttpException, HttpStatus } from "../../core";
import { IAuditLogger } from "../audit-log";
import { IAddDeliveryPayload, IDelivery, IDeliveryQuery } from "./delivery.interface";
import { DeliveryRepository } from "./delivery.repository";
import { SearchItemDto } from "./dto/search.dto";

export class DeliveryService implements IDeliveryQuery {
  private readonly deliveryRepo: DeliveryRepository;

  constructor(
    repo: DeliveryRepository,
    private readonly auditLogger: IAuditLogger,
  ) {
    this.deliveryRepo = repo;
  }

  public async getDetail(id: string): Promise<IDelivery> {
    const item = await this.deliveryRepo.getById(id);
    if (!item) {
      throw new HttpException(HttpStatus.BadRequest, "Delivery not found");
    }
    return item;
  }

  public async getItemByOrderId(orderId: string): Promise<IDelivery> {
    const item = await this.deliveryRepo.getItemByOrderId(orderId);
    if (!item) {
      throw new HttpException(HttpStatus.BadRequest, "Delivery not found by order id");
    }
    return item;
  }

  public async searchDeliveries(payload: SearchItemDto) {
    // 🔥 validate
    if (!payload.staff_id && !payload.customer_id && !payload.franchise_id) {
      throw new HttpException(
        HttpStatus.BadRequest,
        "Please provide at least one field in: staff_id, customer_id or franchise_id",
      );
    }

    return this.deliveryRepo.searchDeliveries(payload);
  }

  // External dependencies
  public async getById(id: string): Promise<IDelivery | null> {
    return this.deliveryRepo.findById(id);
  }

  public async findByIdWithSession(id: string, session: ClientSession): Promise<IDelivery | null> {
    return this.deliveryRepo.findByIdWithSession(id, session);
  }

  public async createDelivery(payload: IAddDeliveryPayload, session?: ClientSession): Promise<IDelivery> {
    return this.deliveryRepo.create(payload, session);
  }

  public async updateToPickingUp(delivery: IDelivery, session?: ClientSession): Promise<IDelivery> {
    delivery.status = DeliveryStatus.PICKING_UP;
    delivery.picked_up_at = new Date();
    return delivery.save({ session });
  }

  public async updateToDelivered(delivery: IDelivery, session?: ClientSession): Promise<IDelivery> {
    delivery.status = DeliveryStatus.DELIVERED;
    delivery.delivered_at = new Date();
    return delivery.save({ session });
  }

  public async countItems(franchiseId?: Types.ObjectId): Promise<Record<string, number>> {
    return this.deliveryRepo.countByStatus("status", Object.values(DeliveryStatus), franchiseId);
  }
}
