import { ClientSession, Types } from "mongoose";
import { BaseRepository } from "../../core";
import { IRefund } from "./refund.interface";
import RefundSchema from "./refund.model";

export class RefundRepository extends BaseRepository<IRefund> {
  constructor() {
    super(RefundSchema);
  }

  public async findByPaymentId(paymentId: Types.ObjectId, session?: ClientSession): Promise<IRefund | null> {
    const query = this.model.findOne({
      payment_id: paymentId,
      is_deleted: false,
    });

    if (session) query.session(session);

    return query;
  }
}
