import { PipelineStage, Types } from "mongoose";
import { formatItemsQuery, HttpException, HttpStatus, MSG_BUSINESS } from "../../core";
import { BaseRepository } from "../../core/repository";
import { ICategoryFranchise } from "./category-franchise.interface";
import CategoryFranchiseSchema from "./category-franchise.model";
import { SearchItemDto, SearchPaginationItemDto } from "./dto/search.dto";

export class CategoryFranchiseRepository extends BaseRepository<ICategoryFranchise> {
  constructor() {
    super(CategoryFranchiseSchema);
  }

  public async getItems(model: SearchPaginationItemDto): Promise<{ data: ICategoryFranchise[]; total: number }> {
    const searchCondition = { ...new SearchItemDto(), ...model.searchCondition };

    const { franchise_id, category_id, is_active, is_deleted } = searchCondition;

    const { pageNum, pageSize } = model.pageInfo;

    let matchQuery: Record<string, any> = {};

    // 1. Filter by category_id
    if (category_id && Types.ObjectId.isValid(category_id)) {
      matchQuery.category_id = new Types.ObjectId(category_id);
    }

    // 2. Filter by franchise_id
    if (franchise_id && Types.ObjectId.isValid(franchise_id)) {
      matchQuery.franchise_id = new Types.ObjectId(franchise_id);
    }

    // 3. Common filters
    matchQuery = formatItemsQuery(matchQuery, { is_active, is_deleted });

    const skip = (pageNum - 1) * pageSize;

    try {
      const result = await this.model.aggregate([
        { $match: matchQuery },

        // 🔹 JOIN CATEGORY
        {
          $lookup: {
            from: "categories",
            localField: "category_id",
            foreignField: "_id",
            as: "category",
          },
        },
        { $unwind: "$category" },

        // 🔹 JOIN FRANCHISE
        {
          $lookup: {
            from: "franchises",
            localField: "franchise_id",
            foreignField: "_id",
            as: "franchise",
          },
        },
        { $unwind: "$franchise" },

        {
          $facet: {
            data: [
              { $sort: { display_order: 1, created_at: -1 } },
              { $skip: skip },
              { $limit: pageSize },
              {
                $project: {
                  _id: 1,
                  category_id: 1,
                  franchise_id: 1,
                  size: 1,
                  price_base: 1,
                  is_active: 1,
                  is_deleted: 1,
                  created_at: 1,
                  updated_at: 1,
                  display_order: 1,

                  // 🔥 add fields
                  category_name: "$category.name",
                  franchise_name: "$franchise.name",
                },
              },
            ],
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

  public async getCategoriesByFranchiseId(
    franchiseId: string,
    isActive: boolean = true,
  ): Promise<ICategoryFranchise[]> {
    if (!Types.ObjectId.isValid(franchiseId)) {
      return [];
    }

    const franchiseObjectId = new Types.ObjectId(franchiseId);

    const pipeline: PipelineStage[] = [
      // 1️⃣ Match category_franchise
      {
        $match: {
          franchise_id: franchiseObjectId,
          is_deleted: false,
          ...(isActive !== undefined ? { is_active: isActive } : {}),
        },
      },

      // 2️⃣ Join category
      {
        $lookup: {
          from: "categories",
          localField: "category_id",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: "$category" },

      // 3️⃣ Join franchise
      {
        $lookup: {
          from: "franchises",
          localField: "franchise_id",
          foreignField: "_id",
          as: "franchise",
        },
      },
      { $unwind: "$franchise" },

      // 4️⃣ Filter active category + franchise
      {
        $match: {
          "category.is_deleted": false,
          "category.is_active": true,
          "franchise.is_deleted": false,
          "franchise.is_active": true,
        },
      },

      // 5️⃣ Project DTO
      {
        $project: {
          _id: 0,
          category_id: "$category._id",
          category_name: "$category.name",
          category_code: "$category.code",

          franchise_id: "$franchise._id",
          franchise_name: "$franchise.name",
          franchise_code: "$franchise.code",

          display_order: "$display_order",
        },
      },

      { $sort: { display_order: 1 } },
    ];

    return this.model.aggregate(pipeline);
  }

  // check if a category is already assigned to a franchise
  public async findByCategoryAndFranchise(categoryId: string, franchiseId: string) {
    return this.model.findOne({
      category_id: categoryId,
      franchise_id: franchiseId,
      is_deleted: false,
    });
  }

  // get all categories assigned to a franchise
  public findByFranchise(franchiseId: string, isActive: boolean | undefined) {
    const filter: any = {
      franchise_id: franchiseId,
      is_deleted: false,
      is_active: isActive !== undefined ? isActive : { $in: [true, false] },
    };

    return this.model.find(filter).sort({ display_order: 1, created_at: 1 });
  }

  // bulk update display order of categories for a franchise
  public async bulkUpdateOrder(items: { id: string; display_order: number }[]) {
    const bulkOps = items.map((item) => ({
      updateOne: {
        filter: { _id: item.id, is_deleted: false },
        update: { $set: { display_order: item.display_order } },
      },
    }));

    return this.model.bulkWrite(bulkOps);
  }

  public async deactivateByFranchise(franchiseId: string) {
    return this.model.updateMany({ franchise_id: franchiseId }, { $set: { is_active: false } });
  }
}
