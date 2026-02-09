import { MSG_BUSINESS } from "../../core/constants";
import { HttpStatus } from "../../core/enums";
import { HttpException } from "../../core/exceptions";
import { BaseRepository } from "../../core/repository";
import { formatItemsQuery } from "../../core/utils";
import { ICategory } from "./category.interface";
import CategorySchema from "./category.model";
import { SearchItemDto, SearchPaginationItemDto } from "./dto/search.dto";

export class CategoryRepository extends BaseRepository<ICategory> {
  constructor() {
    super(CategorySchema);
  }

  public async getItems(model: SearchPaginationItemDto): Promise<{ data: ICategory[]; total: number }> {
    const searchCondition = {
      ...new SearchItemDto(),
      ...model.searchCondition,
    };

    const { keyword, parent_id, is_active, is_deleted } = searchCondition;
    const { pageNum, pageSize } = model.pageInfo;

    let matchQuery: Record<string, any> = {};

    // keyword search
    if (keyword?.trim()) {
      matchQuery.$or = [
        { code: { $regex: keyword.trim(), $options: "i" } },
        { name: { $regex: keyword.trim(), $options: "i" } },
      ];
    }

    // filter by parent_id (if any)
    if (parent_id) {
      matchQuery.parent_id = parent_id;
    }

    // common filters
    matchQuery = formatItemsQuery(matchQuery, { is_active, is_deleted });

    const skip = (pageNum - 1) * pageSize;

    try {
      const result = await this.model.aggregate([
        { $match: matchQuery },
        {
          $lookup: {
            from: "categories",
            localField: "parent_id",
            foreignField: "_id",
            as: "parent",
          },
        },
        {
          $unwind: {
            path: "$parent",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $addFields: {
            parent_name: "$parent.name",
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
