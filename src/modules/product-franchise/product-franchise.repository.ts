import { ObjectId, PipelineStage, Types } from "mongoose";
import { MSG_BUSINESS } from "../../core/constants";
import { HttpStatus } from "../../core/enums";
import { HttpException } from "../../core/exceptions";
import { BaseRepository } from "../../core/repository";
import { formatItemsQuery } from "../../core/utils";
import { PublicProductDetailDto, PublicProductItemDto } from "./dto/item.dto";
import { SearchItemDto, SearchPaginationItemDto } from "./dto/search.dto";
import { IProductFranchise } from "./product-franchise.interface";
import ProductFranchiseSchema from "./product-franchise.model";

export class ProductFranchiseRepository extends BaseRepository<IProductFranchise> {
  constructor() {
    super(ProductFranchiseSchema);
  }

  // check if a product is already assigned to a franchise
  public async findByProductFranchiseAndSize(
    productId: string,
    franchiseId: string,
    size: string | null,
    options?: { excludeId?: string },
  ): Promise<IProductFranchise | null> {
    const query: any = {
      product_id: productId,
      franchise_id: franchiseId,
      size: size ?? null,
      is_deleted: false,
    };

    if (options?.excludeId) {
      query._id = { $ne: options.excludeId };
    }

    return this.model.findOne(query);
  }

  // A: CRUD methods...
  public async getItems(model: SearchPaginationItemDto): Promise<{ data: IProductFranchise[]; total: number }> {
    const searchCondition = { ...new SearchItemDto(), ...model.searchCondition };

    const { product_id, franchise_id, size, price_from, price_to, is_active, is_deleted } = searchCondition;

    const { pageNum, pageSize } = model.pageInfo;

    let matchQuery: Record<string, any> = {};

    // 1. Filter by product_id
    if (product_id) {
      matchQuery.product_id = product_id;
    }

    // 2. Filter by franchise_id
    if (franchise_id) {
      matchQuery.franchise_id = franchise_id;
    }

    // 3. Filter by size (string, exact or regex)
    if (size?.trim()) {
      matchQuery.size = new RegExp(`^${size.trim()}$`, "i");
    }

    // 4. Price range filter
    if (price_from !== undefined || price_to !== undefined) {
      matchQuery.price_base = {};
      if (price_from !== undefined) matchQuery.price_base.$gte = price_from;
      if (price_to !== undefined) matchQuery.price_base.$lte = price_to;
    }

    // 5. Common filters
    matchQuery = formatItemsQuery(matchQuery, { is_active, is_deleted });

    const skip = (pageNum - 1) * pageSize;

    try {
      const result = await this.model.aggregate([
        { $match: matchQuery },

        // 🔹 JOIN PRODUCT
        {
          $lookup: {
            from: "products",
            localField: "product_id",
            foreignField: "_id",
            as: "product",
          },
        },
        { $unwind: "$product" },

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
              { $sort: { created_at: -1 } },
              { $skip: skip },
              { $limit: pageSize },
              {
                $project: {
                  _id: 1,
                  product_id: 1,
                  franchise_id: 1,
                  size: 1,
                  price_base: 1,
                  is_active: 1,
                  is_deleted: 1,
                  created_at: 1,
                  updated_at: 1,

                  // 🔥 add fields
                  product_name: "$product.name",
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

  // TODO: do after
  // B: Business / Menu

  public async getMenuByFranchise(franchiseId: string, categoryId?: string): Promise<any[]> {
    if (!Types.ObjectId.isValid(franchiseId)) return [];

    const pipeline: PipelineStage[] = [
      ...this.buildBaseProductPipeline(franchiseId, categoryId),

      // 🔥 Project base fields + display_order
      {
        $project: {
          _id: 0,

          product_franchise_id: "$_id",
          product_id: "$product._id",

          category_id: "$category._id",
          category_name: "$category.name",
          category_display_order: "$cf.display_order",

          product_display_order: "$pcf.display_order",

          SKU: "$product.SKU",
          name: "$product.name",
          description: "$product.description",
          image_url: "$product.image_url",

          price: "$price_base",
          size: "$size",
          is_have_topping: "$product.is_have_topping",

          is_available: {
            $cond: [{ $gt: ["$inventory.quantity", 0] }, true, false],
          },
        },
      },

      // 🔥 Sort đúng business logic
      {
        $sort: {
          category_display_order: 1,
          product_display_order: 1,
          size: 1,
        },
      },

      // 🔥 1️⃣ Group sizes theo product
      {
        $group: {
          _id: "$product_id",

          product_id: { $first: "$product_id" },
          category_id: { $first: "$category_id" },
          category_name: { $first: "$category_name" },
          category_display_order: { $first: "$category_display_order" },
          product_display_order: { $first: "$product_display_order" },

          SKU: { $first: "$SKU" },
          name: { $first: "$name" },
          description: { $first: "$description" },
          image_url: { $first: "$image_url" },
          is_have_topping: { $first: "$is_have_topping" },

          sizes: {
            $push: {
              product_franchise_id: "$product_franchise_id",
              size: "$size",
              price: "$price",
              is_available: "$is_available",
            },
          },
        },
      },

      // 🔥 2️⃣ Group products theo category
      {
        $group: {
          _id: "$category_id",

          category_id: { $first: "$category_id" },
          category_name: { $first: "$category_name" },
          category_display_order: { $first: "$category_display_order" },

          products: {
            $push: {
              product_id: "$product_id",
              name: "$name",
              description: "$description",
              image_url: "$image_url",
              is_have_topping: "$is_have_topping",
              sizes: "$sizes",
            },
          },
        },
      },

      // 🔥 Sort category cuối cùng
      {
        $sort: {
          category_display_order: 1,
        },
      },

      {
        $project: {
          _id: 0,
        },
      },
    ];

    return this.model.aggregate(pipeline);
  }

  public async getPublicProducts(franchiseId: string, categoryId?: string): Promise<PublicProductItemDto[]> {
    if (!Types.ObjectId.isValid(franchiseId)) return [];

    const pipeline: PipelineStage[] = [
      ...this.buildBaseProductPipeline(franchiseId, categoryId),

      // 🔥 Project base fields + display_order
      {
        $project: {
          _id: 0,

          product_franchise_id: "$_id",
          product_id: "$product._id",

          category_id: "$category._id",
          category_name: "$category.name",
          category_display_order: "$cf.display_order", // 🔥

          product_display_order: "$pcf.display_order", // 🔥

          SKU: "$product.SKU",
          name: "$product.name",
          description: "$product.description",
          image_url: "$product.image_url",

          price: "$price_base",
          size: "$size",
          is_have_topping: "$product.is_have_topping",

          is_available: {
            $cond: [{ $gt: ["$inventory.quantity", 0] }, true, false],
          },
        },
      },

      // 🔥 sort theo business logic
      {
        $sort: {
          category_display_order: 1,
          product_display_order: 1,
          size: 1,
        },
      },

      // 🔥 group sizes theo product
      {
        $group: {
          _id: "$product_id",

          product_id: { $first: "$product_id" },
          category_id: { $first: "$category_id" },
          category_name: { $first: "$category_name" },
          category_display_order: { $first: "$category_display_order" },
          product_display_order: { $first: "$product_display_order" },

          SKU: { $first: "$SKU" },
          name: { $first: "$name" },
          description: { $first: "$description" },
          image_url: { $first: "$image_url" },
          is_have_topping: { $first: "$is_have_topping" },

          sizes: {
            $push: {
              product_franchise_id: "$product_franchise_id",
              size: "$size",
              price: "$price",
              is_available: "$is_available",
            },
          },
        },
      },

      {
        $sort: {
          category_display_order: 1,
          product_display_order: 1,
        },
      },

      {
        $project: {
          _id: 0,
        },
      },
    ];

    return this.model.aggregate(pipeline);
  }

  public async getPublicProductDetail(productFranchiseId: string): Promise<PublicProductDetailDto | null> {
    if (!Types.ObjectId.isValid(productFranchiseId)) return null;

    // 1️⃣ Lấy product_franchise
    const productFranchise = await this.model
      .findOne({
        _id: new Types.ObjectId(productFranchiseId),
        is_active: true,
        is_deleted: false,
      })
      .lean();

    if (!productFranchise) return null;

    const { product_id, franchise_id } = productFranchise;

    if (!Types.ObjectId.isValid(product_id)) return null;
    if (!Types.ObjectId.isValid(franchise_id)) return null;

    const productObjectId = new Types.ObjectId(product_id);
    const franchiseObjectId = new Types.ObjectId(franchise_id);

    const pipeline: PipelineStage[] = [
      // 1️⃣ Match product_franchise theo product + franchise
      {
        $match: {
          product_id: productObjectId,
          franchise_id: franchiseObjectId,
          is_active: true,
          is_deleted: false,
        },
      },

      // 2️⃣ Join product
      {
        $lookup: {
          from: "products",
          localField: "product_id",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },

      // 3️⃣ Join inventory
      {
        $lookup: {
          from: "inventories",
          localField: "_id",
          foreignField: "product_franchise_id",
          as: "inventory",
        },
      },
      {
        $unwind: {
          path: "$inventory",
          preserveNullAndEmptyArrays: true,
        },
      },

      // 4️⃣ Join category (giữ nguyên logic của em)
      {
        $lookup: {
          from: "productcategoryfranchises",
          localField: "_id",
          foreignField: "product_franchise_id",
          as: "pcf",
        },
      },
      { $unwind: "$pcf" },
      {
        $lookup: {
          from: "categoryfranchises",
          localField: "pcf.category_franchise_id",
          foreignField: "_id",
          as: "cf",
        },
      },
      { $unwind: "$cf" },
      {
        $lookup: {
          from: "categories",
          localField: "cf.category_id",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: "$category" },

      // 5️⃣ Filter product active
      {
        $match: {
          "product.is_active": true,
          "product.is_deleted": false,
        },
      },

      // 6️⃣ Group sizes
      {
        $group: {
          _id: "$product_id",

          product_id: { $first: "$product._id" },
          category_id: { $first: "$category._id" },
          category_name: { $first: "$category.name" },

          SKU: { $first: "$product.SKU" },
          name: { $first: "$product.name" },
          description: { $first: "$product.description" },
          content: { $first: "$product.content" },
          image_url: { $first: "$product.image_url" },
          images_url: { $first: "$product.images_url" },
          is_have_topping: { $first: "$product.is_have_topping" },

          sizes: {
            $push: {
              product_franchise_id: "$_id",
              size: "$size",
              price: "$price_base",
              is_available: {
                $cond: [{ $gt: ["$inventory.quantity", 0] }, true, false],
              },
            },
          },
        },
      },

      {
        $project: {
          _id: 0,
        },
      },
    ];

    const result = await this.model.aggregate(pipeline);
    return result[0] || null;
  }

  private buildBaseProductPipeline(franchiseId: string, categoryId?: string): PipelineStage[] {
    const franchiseObjectId = new Types.ObjectId(franchiseId);
    const categoryObjectId =
      categoryId && Types.ObjectId.isValid(categoryId) ? new Types.ObjectId(categoryId) : undefined;

    const pipeline: PipelineStage[] = [
      // 1️⃣ Match productfranchise
      {
        $match: {
          franchise_id: franchiseObjectId,
          is_active: true,
          is_deleted: false,
        },
      },

      // 2️⃣ Join product
      {
        $lookup: {
          from: "products",
          localField: "product_id",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },

      {
        $match: {
          "product.is_active": true,
          "product.is_deleted": false,
        },
      },

      // 3️⃣ Join inventory
      {
        $lookup: {
          from: "inventories",
          localField: "_id",
          foreignField: "product_franchise_id",
          as: "inventory",
        },
      },
      {
        $unwind: {
          path: "$inventory",
          preserveNullAndEmptyArrays: true,
        },
      },

      // 4️⃣ Join productcategoryfranchise
      {
        $lookup: {
          from: "productcategoryfranchises",
          localField: "_id",
          foreignField: "product_franchise_id",
          as: "pcf",
        },
      },
      { $unwind: "$pcf" },

      // 5️⃣ Join categoryfranchise
      {
        $lookup: {
          from: "categoryfranchises",
          localField: "pcf.category_franchise_id",
          foreignField: "_id",
          as: "cf",
        },
      },
      { $unwind: "$cf" },

      // 6️⃣ Join category
      {
        $lookup: {
          from: "categories",
          localField: "cf.category_id",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: "$category" },
    ];

    // 🔥 Filter by category nếu có
    if (categoryObjectId) {
      pipeline.push({
        $match: {
          "category._id": categoryObjectId,
        },
      });
    }

    return pipeline;
  }
}
