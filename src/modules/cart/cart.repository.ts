import { Types } from "mongoose";
import { BaseRepository, CartStatus, formatItemsQuery, HttpException, HttpStatus, MSG_BUSINESS } from "../../core";
import { ICart } from "./cart.interface";
import CartSchema from "./cart.model";
import { SearchItemDto, SearchPaginationItemDto } from "./dto/search.dto";

export class CartRepository extends BaseRepository<ICart> {
  constructor() {
    super(CartSchema);
  }

  public async getCartStatusActive(customer_id: string, franchise_id: string): Promise<ICart | null> {
    return this.model.findOne({
      customer_id: new Types.ObjectId(customer_id),
      franchise_id: new Types.ObjectId(franchise_id),
      status: CartStatus.ACTIVE,
      is_deleted: false,
    });
  }

  public async getItems(model: SearchPaginationItemDto): Promise<{ data: ICart[]; total: number }> {
    const searchCondition = {
      ...new SearchItemDto(),
      ...model.searchCondition,
    };

    const { franchise_id, customer_id, staff_id, status, start_date, end_date, is_deleted } = searchCondition;

    const { pageNum, pageSize } = model.pageInfo;
    const skip = (pageNum - 1) * pageSize;

    let matchQuery: Record<string, any> = {};

    // common filters
    matchQuery = formatItemsQuery(matchQuery, { is_deleted });

    // ===== Basic filters =====
    if (franchise_id) {
      matchQuery.franchise_id = new Types.ObjectId(franchise_id);
    }

    if (customer_id) {
      matchQuery.customer_id = new Types.ObjectId(customer_id);
    }

    if (staff_id) {
      matchQuery.staff_id = new Types.ObjectId(staff_id);
    }

    if (status) {
      matchQuery.status = status;
    }

    if (start_date || end_date) {
      matchQuery.created_at = {};

      if (start_date) {
        matchQuery.created_at.$gte = new Date(start_date);
      }

      if (end_date) {
        const end = new Date(end_date);
        end.setHours(23, 59, 59, 999);
        matchQuery.created_at.$lte = end;
      }
    }

    try {
      const result = await this.model.aggregate([
        { $match: matchQuery },

        // ===== Franchise lookup =====
        {
          $lookup: {
            from: "franchises",
            localField: "franchise_id",
            foreignField: "_id",
            as: "franchise",
          },
        },
        { $unwind: { path: "$franchise", preserveNullAndEmptyArrays: true } },

        // ===== Customer lookup =====
        {
          $lookup: {
            from: "customers",
            localField: "customer_id",
            foreignField: "_id",
            as: "customer",
          },
        },
        { $unwind: { path: "$customer", preserveNullAndEmptyArrays: true } },

        // ===== Staff lookup =====
        {
          $lookup: {
            from: "users",
            localField: "staff_id",
            foreignField: "_id",
            as: "staff",
          },
        },
        { $unwind: { path: "$staff", preserveNullAndEmptyArrays: true } },

        // ===== Voucher lookup =====
        {
          $lookup: {
            from: "vouchers",
            localField: "voucher_id",
            foreignField: "_id",
            as: "voucher",
          },
        },
        { $unwind: { path: "$voucher", preserveNullAndEmptyArrays: true } },

        // ===== Add computed fields =====
        {
          $addFields: {
            franchise_name: "$franchise.name",

            customer_name: "$customer.name",
            customer_email: "$customer.email",
            customer_phone: "$customer.phone",

            staff_name: "$staff.name",

            voucher_code: "$voucher.code",
          },
        },

        // ===== Remove raw lookup objects =====
        {
          $project: {
            franchise: 0,
            customer: 0,
            staff: 0,
            voucher: 0,
          },
        },

        {
          $facet: {
            data: [{ $sort: { created_at: -1 } }, { $skip: skip }, { $limit: pageSize }],
            total: [{ $count: "count" }],
          },
        },
      ]);

      return {
        data: result[0].data,
        total: result[0].total[0]?.count || 0,
      };
    } catch (error) {
      throw new HttpException(HttpStatus.BadRequest, MSG_BUSINESS.DATABASE_QUERY_FAILED);
    }
  }
}
