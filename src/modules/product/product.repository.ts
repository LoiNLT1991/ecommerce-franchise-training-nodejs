import { MSG_BUSINESS } from "../../core/constants";
import { HttpStatus } from "../../core/enums";
import { HttpException } from "../../core/exceptions";
import { BaseRepository } from "../../core/repository";
import { formatItemsQuery } from "../../core/utils";
import { SearchItemDto, SearchPaginationItemDto } from "./dto/search.dto";
import { IProduct } from "./product.interface";
import ProductSchema from "./product.model";

export class ProductRepository extends BaseRepository<IProduct> {
  constructor() {
    super(ProductSchema);
  }

  public async getItems(model: SearchPaginationItemDto): Promise<{ data: IProduct[]; total: number }> {
    const searchCondition = {
      ...new SearchItemDto(),
      ...model.searchCondition,
    };

    const { keyword, min_price, max_price, is_active, is_deleted } = searchCondition;
    const { pageNum, pageSize } = model.pageInfo;

    let matchQuery: Record<string, any> = {};

    // 1. Keyword search (SKU + name)
    if (keyword?.trim()) {
      const regex = new RegExp(keyword.trim(), "i");
      matchQuery.$or = [{ SKU: regex }, { name: regex }];
    }

    // 2. Price range filter (overlap logic)
    if (min_price !== undefined || max_price !== undefined) {
      matchQuery.$and = [];

      if (min_price !== undefined) {
        matchQuery.$and.push({ max_price: { $gte: min_price } });
      }

      if (max_price !== undefined) {
        matchQuery.$and.push({ min_price: { $lte: max_price } });
      }
    }

    // 3. Common filters (is_active, is_deleted)
    matchQuery = formatItemsQuery(matchQuery, { is_active, is_deleted });

    const skip = (pageNum - 1) * pageSize;

    try {
      const result = await this.model.aggregate([
        { $match: matchQuery },
        {
          $facet: {
            data: [{ $sort: { created_at: -1 } }, { $skip: skip }, { $limit: pageSize }],
            total: [{ $count: "count" }],
          },
        },
      ]);

      return {
        data: result[0]?.data || [],
        total: result[0]?.total[0]?.count || 0,
      };
    } catch (error) {
      throw new HttpException(HttpStatus.BadRequest, MSG_BUSINESS.DATABASE_QUERY_FAILED);
    }
  }
}
