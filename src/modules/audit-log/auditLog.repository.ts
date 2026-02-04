import { Types } from "mongoose";
import { MSG_BUSINESS } from "../../core/constants";
import { HttpStatus } from "../../core/enums";
import { HttpException } from "../../core/exceptions";
import { BaseRepository } from "../../core/repository";
import { IAuditLog } from "./auditLog.interface";
import AuditLogSchema from "./auditLog.model";
import { SearchAuditLogByEntityDto, SearchAuditLogDto, SearchPaginationItemDto } from "./dto/search.dto";

export class AuditLogRepository extends BaseRepository<IAuditLog> {
  constructor() {
    super(AuditLogSchema);
  }

  public async getDetailWithUser(id: string): Promise<IAuditLog | null> {
    const result = await this.model.aggregate([
      {
        $match: {
          _id: new Types.ObjectId(id),
          is_deleted: false,
        },
      },
      {
        $lookup: {
          from: "users",
          let: { userId: { $toObjectId: "$changed_by" } },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$_id", "$$userId"] },
              },
            },
          ],
          as: "user",
        },
      },
      {
        $unwind: {
          path: "$user",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          entity_type: 1,
          entity_id: 1,
          action: 1,
          old_data: 1,
          new_data: 1,
          note: 1,
          created_at: 1,
          changed_by: {
            id: "$changed_by",
            name: "$user.name",
          },
        },
      },
    ]);

    return result[0] || null;
  }

  public async getItems(payload: SearchPaginationItemDto): Promise<{ data: IAuditLog[]; total: number }> {
    const searchCondition = {
      ...new SearchAuditLogDto(),
      ...payload.searchCondition,
    };

    const { keyword, action, changed_by, from_date, to_date } = searchCondition;
    const { pageNum, pageSize } = payload.pageInfo;

    let matchQuery: Record<string, any> = { is_deleted: false };

    // keyword search
    if (keyword?.trim()) {
      matchQuery.$or = [
        { entity_type: { $regex: keyword.trim(), $options: "i" } },
        { note: { $regex: keyword.trim(), $options: "i" } },
      ];
    }

    if (action) {
      matchQuery.action = action;
    }

    if (changed_by) {
      matchQuery.changed_by = changed_by;
    }

    if (from_date || to_date) {
      matchQuery.created_at = {};
      if (from_date) matchQuery.created_at.$gte = new Date(from_date);
      if (to_date) matchQuery.created_at.$lte = new Date(to_date);
    }

    const skip = (pageNum - 1) * pageSize;

    try {
      const result = await this.model.aggregate([
        { $match: matchQuery },

        // 🔥 FIXED LOOKUP (string → ObjectId)
        {
          $lookup: {
            from: "users",
            let: { userId: { $toObjectId: "$changed_by" } },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ["$_id", "$$userId"] },
                },
              },
            ],
            as: "user",
          },
        },
        {
          $unwind: {
            path: "$user",
            preserveNullAndEmptyArrays: true,
          },
        },

        // 🔥 SHAPE RESPONSE
        {
          $project: {
            entity_type: 1,
            entity_id: 1,
            action: 1,
            note: 1,
            created_at: 1,
            old_data: 1,
            new_data: 1,
            changed_by: {
              id: "$changed_by",
              name: "$user.name",
            },
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

  public async getLogsByEntity(payload: SearchAuditLogByEntityDto): Promise<IAuditLog[]> {
    const { entity_id } = payload;
    const limit = payload.limit ?? 20;

    const docs = await this.model.aggregate([
      {
        $match: {
          entity_id,
          is_deleted: false,
        },
      },

      // 🔥 JOIN USER (string -> ObjectId)
      {
        $lookup: {
          from: "users",
          let: { userId: { $toObjectId: "$changed_by" } },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$_id", "$$userId"] },
              },
            },
          ],
          as: "user",
        },
      },
      {
        $unwind: {
          path: "$user",
          preserveNullAndEmptyArrays: true,
        },
      },

      // 🔥 SHAPE RESPONSE
      {
        $project: {
          entity_type: 1,
          entity_id: 1,
          action: 1,
          note: 1,
          created_at: 1,
          old_data: 1,
          new_data: 1,
          changed_by: {
            id: "$changed_by",
            name: "$user.name",
          },
        },
      },

      { $sort: { created_at: -1 } },
      { $limit: limit },
    ]);

    return docs;
  }
}
