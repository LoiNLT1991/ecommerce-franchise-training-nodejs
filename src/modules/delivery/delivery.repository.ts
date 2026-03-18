import { ClientSession, Types } from "mongoose";
import { BaseRepository, DeliveryStatus } from "../../core";
import { IDelivery } from "./delivery.interface";
import DeliverySchema from "./delivery.model";
import { SearchItemDto } from "./dto/search.dto";

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

  public async getById(deliveryId: string): Promise<IDelivery | null> {
    const result = await this.model.aggregate([
      ...this.buildDeliveryAggregate({
        _id: new Types.ObjectId(deliveryId),
        is_deleted: false,
      }),
    ]);

    return result[0] || null;
  }

  public async getItemByOrderId(orderId: string, session?: ClientSession): Promise<IDelivery | null> {
    const pipeline = [
      ...this.buildDeliveryAggregate({
        order_id: new Types.ObjectId(orderId),
        is_deleted: false,
      }),
    ];

    const query = this.model.aggregate(pipeline);

    if (session) query.session(session);

    const result = await query;

    return result[0] || null;
  }

  public async searchDeliveries(payload: SearchItemDto) {
    const { franchise_id, customer_id, staff_id, status } = payload;

    // 🔥 preMatch (trước lookup)
    const preMatch: Record<string, any> = {
      is_deleted: false,
    };

    if (status) {
      preMatch.status = status;
    }

    if (staff_id) {
      preMatch.assigned_to = new Types.ObjectId(staff_id);
    }

    // 🔥 postMatch (sau lookup)
    const postMatch: Record<string, any> = {};

    if (customer_id) {
      postMatch.customer_id = new Types.ObjectId(customer_id);
    }

    if (franchise_id) {
      postMatch.franchise_id = new Types.ObjectId(franchise_id);
    }

    const pipeline = this.buildDeliveryQuery({
      preMatch,
      postMatch: Object.keys(postMatch).length ? postMatch : undefined,
    });

    return this.model.aggregate(pipeline);
  }

  private buildDeliveryQuery({
    preMatch,
    postMatch,
  }: {
    preMatch: Record<string, any>;
    postMatch?: Record<string, any>;
  }) {
    const pipeline: any[] = [...this.buildDeliveryAggregate(preMatch)];

    if (postMatch) {
      pipeline.push({ $match: postMatch });
    }

    pipeline.push({
      $sort: {
        updated_at: -1,
        created_at: -1,
      },
    });

    return pipeline;
  }

  private buildDeliveryAggregate(matchQuery: Record<string, any>) {
    return [
      { $match: matchQuery },

      // 🔥 order
      {
        $lookup: {
          from: "orders",
          localField: "order_id",
          foreignField: "_id",
          as: "order",
        },
      },
      { $unwind: { path: "$order", preserveNullAndEmptyArrays: true } },

      // 🔥 franchise
      {
        $lookup: {
          from: "franchises",
          localField: "order.franchise_id",
          foreignField: "_id",
          as: "franchise",
        },
      },
      { $unwind: { path: "$franchise", preserveNullAndEmptyArrays: true } },

      // 🔥 customer
      {
        $lookup: {
          from: "customers",
          localField: "order.customer_id",
          foreignField: "_id",
          as: "customer",
        },
      },
      { $unwind: { path: "$customer", preserveNullAndEmptyArrays: true } },

      // 🔥 assigned_to
      {
        $lookup: {
          from: "users",
          localField: "assigned_to",
          foreignField: "_id",
          as: "assigned_to_user",
        },
      },
      { $unwind: { path: "$assigned_to_user", preserveNullAndEmptyArrays: true } },

      // 🔥 assigned_by
      {
        $lookup: {
          from: "users",
          localField: "assigned_by",
          foreignField: "_id",
          as: "assigned_by_user",
        },
      },
      { $unwind: { path: "$assigned_by_user", preserveNullAndEmptyArrays: true } },

      // 🔥 addFields
      {
        $addFields: {
          order_code: "$order.code",

          customer_id: "$order.customer_id",
          customer_name: "$customer.name",
          customer_email: "$customer.email",
          customer_phone: "$customer.phone",

          order_address: "$order.address",
          order_phone: "$order.phone",
          order_message: "$order.message",

          franchise_id: "$order.franchise_id",
          franchise_name: "$franchise.name",

          // 🔥 NEW STAFF FIELDS
          assigned_to_name: "$assigned_to_user.name",
          assigned_to_email: "$assigned_to_user.email",

          assigned_by_name: "$assigned_by_user.name",
          assigned_by_email: "$assigned_by_user.email",
        },
      },

      {
        $project: {
          order: 0,
          customer: 0,
          franchise: 0,
          assigned_to_user: 0,
          assigned_by_user: 0,
        },
      },
    ];
  }
}
