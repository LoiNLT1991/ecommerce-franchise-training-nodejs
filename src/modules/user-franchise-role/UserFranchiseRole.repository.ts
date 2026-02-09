import { PipelineStage, Types } from "mongoose";
import { MSG_BUSINESS } from "../../core/constants";
import { HttpStatus } from "../../core/enums";
import { HttpException } from "../../core/exceptions";
import { BaseRepository } from "../../core/repository";
import { formatItemsQuery } from "../../core/utils";
import { SearchItemDto, SearchPaginationItemDto } from "./dto/search.dto";
import { IUserFranchiseRole } from "./UserFranchiseRole.interface";
import UserFranchiseRoleSchema from "./UserFranchiseRole.model";

export class UserFranchiseRoleRepository extends BaseRepository<IUserFranchiseRole> {
  constructor() {
    super(UserFranchiseRoleSchema);
  }

  public async getItem(id: string): Promise<IUserFranchiseRole | null> {
    const query = [
      ...this.buildQueryPipeline({
        _id: new Types.ObjectId(id),
        is_deleted: false,
      }),
      { $limit: 1 },
    ];
    const result = await this.model.aggregate(query);
    return result[0] || null;
  }

  public async getItems(model: SearchPaginationItemDto): Promise<{ data: any[]; total: number }> {
    const searchCondition = {
      ...new SearchItemDto(),
      ...model.searchCondition,
    };

    const { user_id, franchise_id, role_id, is_deleted } = searchCondition;
    const { pageNum, pageSize } = model.pageInfo;

    let matchQuery: Record<string, any> = {};

    // common + dynamic filters
    matchQuery = formatItemsQuery(matchQuery, {
      is_deleted,
      user_id,
      franchise_id,
      role_id,
    });

    const skip = (pageNum - 1) * pageSize;

    try {
      const query: PipelineStage[] = [
        ...this.buildQueryPipeline(matchQuery),
        {
          $facet: {
            data: [{ $sort: { created_at: -1 } }, { $skip: skip }, { $limit: pageSize }],
            total: [{ $count: "count" }],
          },
        },
      ];

      const result = await this.model.aggregate(query);

      return {
        data: result[0].data,
        total: result[0].total[0]?.count || 0,
      };
    } catch (error) {
      throw new HttpException(HttpStatus.BadRequest, MSG_BUSINESS.DATABASE_QUERY_FAILED);
    }
  }

  private buildQueryPipeline(matchQuery: Record<string, any>): PipelineStage[] {
    return [
      // 1. Filter
      { $match: matchQuery },

      // 2. Lookup related data
      {
        $lookup: {
          from: "franchises",
          let: {
            franchiseId: {
              $cond: [
                {
                  $regexMatch: {
                    input: "$franchise_id",
                    regex: /^[a-f0-9]{24}$/i,
                  },
                },
                { $toObjectId: "$franchise_id" },
                null,
              ],
            },
          },
          pipeline: [{ $match: { $expr: { $eq: ["$_id", "$$franchiseId"] } } }, { $project: { code: 1, name: 1 } }],
          as: "franchise",
        },
      },
      {
        $lookup: {
          from: "users",
          let: { userId: { $toObjectId: "$user_id" } },
          pipeline: [{ $match: { $expr: { $eq: ["$_id", "$$userId"] } } }, { $project: { name: 1, email: 1 } }],
          as: "user",
        },
      },
      {
        $lookup: {
          from: "roles",
          let: { roleId: { $toObjectId: "$role_id" } },
          pipeline: [{ $match: { $expr: { $eq: ["$_id", "$$roleId"] } } }, { $project: { code: 1, name: 1 } }],
          as: "role",
        },
      },

      // 3. Unwind arrays
      { $unwind: { path: "$franchise", preserveNullAndEmptyArrays: true } },
      { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
      { $unwind: { path: "$role", preserveNullAndEmptyArrays: true } },

      // 4. Project desired fields
      {
        $project: {
          franchise_id: 1,
          franchise_code: "$franchise.code",
          franchise_name: "$franchise.name",

          user_id: 1,
          user_name: "$user.name",
          user_email: "$user.email",

          role_id: 1,
          role_code: "$role.code",
          role_name: "$role.name",

          note: 1,
          is_deleted: 1,
          created_at: 1,
          updated_at: 1,
        },
      },
    ];
  }
}
