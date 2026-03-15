import { ClientSession, Types } from "mongoose";
import { BaseRepository } from "../../core";
import { IDelivery } from "./delivery.interface";
import DeliverySchema from "./delivery.model";

export class DeliveryRepository extends BaseRepository<IDelivery> {
  constructor() {
    super(DeliverySchema);
  }

  public async findByOrderId(orderId: Types.ObjectId, session?: ClientSession): Promise<IDelivery | null> {
    const query = this.model.findOne({
      order_id: orderId,
      is_deleted: false,
    });

    if (session) query.session(session);

    return query;
  }
}