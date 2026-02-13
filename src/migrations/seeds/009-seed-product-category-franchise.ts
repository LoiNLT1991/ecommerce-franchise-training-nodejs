import CategoryFranchiseSchema from "../../modules/category-franchise/category-franchise.model";
import CategorySchema from "../../modules/category/category.model";
import FranchiseSchema from "../../modules/franchise/franchise.model";
import ProductCategoryFranchiseSchema from "../../modules/product-category-franchise/product-category-franchise.model";
import ProductFranchiseSchema from "../../modules/product-franchise/product-franchise.model";
import ProductSchema from "../../modules/product/product.model";
import { CATEGORY_CODE, FRANCHISE_CODE, PRODUCT_CODE, SEED } from "../constants";
import { runMigration } from "../runner";

const DEFAULT_PRODUCT_CATEGORY_FRANCHISE = [
  // Franchise HL001
  {
    productCode: PRODUCT_CODE.ESP001,
    size: "S",
    categoryCode: CATEGORY_CODE.ESPRESSO,
    franchiseCode: FRANCHISE_CODE.HL001,
    display_order: 1,
  },
  {
    productCode: PRODUCT_CODE.ESP001,
    size: "M",
    categoryCode: CATEGORY_CODE.ESPRESSO,
    franchiseCode: FRANCHISE_CODE.HL001,
    display_order: 1,
  },
  {
    productCode: PRODUCT_CODE.ESP001,
    size: "L",
    categoryCode: CATEGORY_CODE.ESPRESSO,
    franchiseCode: FRANCHISE_CODE.HL001,
    display_order: 1,
  },
  {
    productCode: PRODUCT_CODE.VCOF001,
    size: "S",
    categoryCode: CATEGORY_CODE.VIETNAMESE_COFFEE,
    franchiseCode: FRANCHISE_CODE.HL001,
    display_order: 1,
  },
  {
    productCode: PRODUCT_CODE.VCOF001,
    size: "M",
    categoryCode: CATEGORY_CODE.VIETNAMESE_COFFEE,
    franchiseCode: FRANCHISE_CODE.HL001,
    display_order: 1,
  },
  {
    productCode: PRODUCT_CODE.VCOF001,
    size: "L",
    categoryCode: CATEGORY_CODE.VIETNAMESE_COFFEE,
    franchiseCode: FRANCHISE_CODE.HL001,
    display_order: 1,
  },
  {
    productCode: PRODUCT_CODE.TTHK001,
    size: null,
    categoryCode: CATEGORY_CODE.TOPPING,
    franchiseCode: FRANCHISE_CODE.HL001,
    display_order: 1,
  },
  {
    productCode: PRODUCT_CODE.TTD001,
    size: null,
    categoryCode: CATEGORY_CODE.TOPPING,
    franchiseCode: FRANCHISE_CODE.HL001,
    display_order: 1,
  },
  {
    productCode: PRODUCT_CODE.PLAN001,
    size: null,
    categoryCode: CATEGORY_CODE.TOPPING,
    franchiseCode: FRANCHISE_CODE.HL001,
    display_order: 1,
  },

  // Franchise TN001
  {
    productCode: PRODUCT_CODE.ESP001,
    size: "S",
    categoryCode: CATEGORY_CODE.ESPRESSO,
    franchiseCode: FRANCHISE_CODE.TN001,
    display_order: 1,
  },
  {
    productCode: PRODUCT_CODE.ESP001,
    size: "M",
    categoryCode: CATEGORY_CODE.ESPRESSO,
    franchiseCode: FRANCHISE_CODE.TN001,
    display_order: 1,
  },
  {
    productCode: PRODUCT_CODE.ESP001,
    size: "L",
    categoryCode: CATEGORY_CODE.ESPRESSO,
    franchiseCode: FRANCHISE_CODE.TN001,
    display_order: 1,
  },
  {
    productCode: PRODUCT_CODE.VCOF001,
    size: "S",
    categoryCode: CATEGORY_CODE.VIETNAMESE_COFFEE,
    franchiseCode: FRANCHISE_CODE.TN001,
    display_order: 1,
  },
  {
    productCode: PRODUCT_CODE.VCOF001,
    size: "M",
    categoryCode: CATEGORY_CODE.VIETNAMESE_COFFEE,
    franchiseCode: FRANCHISE_CODE.TN001,
    display_order: 1,
  },
  {
    productCode: PRODUCT_CODE.VCOF001,
    size: "L",
    categoryCode: CATEGORY_CODE.VIETNAMESE_COFFEE,
    franchiseCode: FRANCHISE_CODE.TN001,
    display_order: 1,
  },
  {
    productCode: PRODUCT_CODE.TTHK001,
    size: null,
    categoryCode: CATEGORY_CODE.TOPPING,
    franchiseCode: FRANCHISE_CODE.TN001,
    display_order: 1,
  },
  {
    productCode: PRODUCT_CODE.TTD001,
    size: null,
    categoryCode: CATEGORY_CODE.TOPPING,
    franchiseCode: FRANCHISE_CODE.TN001,
    display_order: 1,
  },
  {
    productCode: PRODUCT_CODE.PLAN001,
    size: null,
    categoryCode: CATEGORY_CODE.TOPPING,
    franchiseCode: FRANCHISE_CODE.TN001,
    display_order: 1,
  },
];

export async function seedProductCategoryFranchiseMigration() {
  await runMigration(SEED.SEED_009_PRODUCT_CATEGORY_FRANCHISE, async () => {
    for (const item of DEFAULT_PRODUCT_CATEGORY_FRANCHISE) {
      // 🔹 1. Find franchise
      const franchise = await FranchiseSchema.findOne({
        code: item.franchiseCode,
        is_deleted: false,
      });

      if (!franchise) {
        console.log(`❌ Franchise ${item.franchiseCode} not found`);
        continue;
      }

      // 🔹 2. Find product
      const product = await ProductSchema.findOne({
        SKU: item.productCode,
        is_deleted: false,
      });

      if (!product) {
        console.log(`❌ Product ${item.productCode} not found`);
        continue;
      }

      // 🔹 3. Find category
      const category = await CategorySchema.findOne({
        code: item.categoryCode,
        is_deleted: false,
      });

      if (!category) {
        console.log(`❌ Category ${item.categoryCode} not found`);
        continue;
      }

      // 🔹 4. Find productFranchise (THÊM SIZE)
      const productFranchise = await ProductFranchiseSchema.findOne({
        franchise_id: franchise._id,
        product_id: product._id,
        size: item.size ?? null,
        is_deleted: false,
      });

      if (!productFranchise) {
        console.log(
          `❌ ProductFranchise not found for ${item.productCode} - size ${item.size} in ${item.franchiseCode}`,
        );
        continue;
      }

      // 🔹 5. Find categoryFranchise
      const categoryFranchise = await CategoryFranchiseSchema.findOne({
        franchise_id: franchise._id,
        category_id: category._id,
        is_deleted: false,
      });

      if (!categoryFranchise) {
        console.log(`❌ CategoryFranchise not found for ${item.categoryCode} in ${item.franchiseCode}`);
        continue;
      }

      // 🔹 6. Upsert mapping
      await ProductCategoryFranchiseSchema.updateOne(
        {
          category_franchise_id: categoryFranchise._id,
          product_franchise_id: productFranchise._id,
        },
        {
          $setOnInsert: {
            display_order: item.display_order ?? 1,
            is_active: true,
            is_deleted: false,
          },
        },
        { upsert: true },
      );

      console.log(
        `✅ Created mapping: ${item.productCode} - ${item.size ?? "N/A"} - ${item.categoryCode} - ${item.franchiseCode}`,
      );
    }
  });
}
