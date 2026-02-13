import CategoryFranchiseSchema from "../../modules/category-franchise/category-franchise.model";
import CategorySchema from "../../modules/category/category.model";
import FranchiseSchema from "../../modules/franchise/franchise.model";
import { CATEGORY_CODE, FRANCHISE_CODE, SEED } from "../constants";
import { runMigration } from "../runner";

const DEFAULT_CATEGORY_FRANCHISE = [
  { categoryCode: CATEGORY_CODE.COFFEE, franchiseCode: FRANCHISE_CODE.HL001, displayOrder: 1 },
  { categoryCode: CATEGORY_CODE.VIETNAMESE_COFFEE, franchiseCode: FRANCHISE_CODE.HL001, displayOrder: 1 },
  { categoryCode: CATEGORY_CODE.ESPRESSO, franchiseCode: FRANCHISE_CODE.HL001, displayOrder: 1 },
  { categoryCode: CATEGORY_CODE.TEA, franchiseCode: FRANCHISE_CODE.HL001, displayOrder: 1 },
  { categoryCode: CATEGORY_CODE.ICE_BLENDED, franchiseCode: FRANCHISE_CODE.HL001, displayOrder: 1 },
  { categoryCode: CATEGORY_CODE.SMOOTHIE, franchiseCode: FRANCHISE_CODE.HL001, displayOrder: 1 },
  { categoryCode: CATEGORY_CODE.NON_COFFEE, franchiseCode: FRANCHISE_CODE.HL001, displayOrder: 1 },
  { categoryCode: CATEGORY_CODE.JUICE, franchiseCode: FRANCHISE_CODE.HL001, displayOrder: 1 },
  { categoryCode: CATEGORY_CODE.BAKERY_SNACK, franchiseCode: FRANCHISE_CODE.HL001, displayOrder: 1 },
  { categoryCode: CATEGORY_CODE.TOPPING, franchiseCode: FRANCHISE_CODE.HL001, displayOrder: 1 },

  { categoryCode: CATEGORY_CODE.COFFEE, franchiseCode: FRANCHISE_CODE.TN001, displayOrder: 1 },
  { categoryCode: CATEGORY_CODE.VIETNAMESE_COFFEE, franchiseCode: FRANCHISE_CODE.TN001, displayOrder: 1 },
  { categoryCode: CATEGORY_CODE.ESPRESSO, franchiseCode: FRANCHISE_CODE.TN001, displayOrder: 1 },
  { categoryCode: CATEGORY_CODE.TEA, franchiseCode: FRANCHISE_CODE.TN001, displayOrder: 1 },
  { categoryCode: CATEGORY_CODE.ICE_BLENDED, franchiseCode: FRANCHISE_CODE.TN001, displayOrder: 1 },
  { categoryCode: CATEGORY_CODE.SMOOTHIE, franchiseCode: FRANCHISE_CODE.TN001, displayOrder: 1 },
  { categoryCode: CATEGORY_CODE.NON_COFFEE, franchiseCode: FRANCHISE_CODE.TN001, displayOrder: 1 },
  { categoryCode: CATEGORY_CODE.JUICE, franchiseCode: FRANCHISE_CODE.TN001, displayOrder: 1 },
  { categoryCode: CATEGORY_CODE.BAKERY_SNACK, franchiseCode: FRANCHISE_CODE.TN001, displayOrder: 1 },
  { categoryCode: CATEGORY_CODE.TOPPING, franchiseCode: FRANCHISE_CODE.TN001, displayOrder: 1 },
];

export async function seedCategoryFranchiseMigration() {
  await runMigration(SEED.SEED_006_CATEGORY_FRANCHISE, async () => {
    for (const item of DEFAULT_CATEGORY_FRANCHISE) {
      // 🔹 1. Lấy category theo code
      const category = await CategorySchema.findOne({
        code: item.categoryCode,
      });

      if (!category) {
        console.log(`❌ Category ${item.categoryCode} not found`);
        continue;
      }

      // 🔹 2. Lấy franchise theo code
      const franchise = await FranchiseSchema.findOne({
        code: item.franchiseCode,
      });

      if (!franchise) {
        console.log(`❌ Franchise ${item.franchiseCode} not found`);
        continue;
      }

      // 🔹 3. Check mapping tồn tại chưa
      const existed = await CategoryFranchiseSchema.findOne({
        category_id: category._id,
        franchise_id: franchise._id,
      });

      if (existed) {
        console.log(`⏩ Mapping ${item.categoryCode} - ${item.franchiseCode} already exists`);
        continue;
      }

      // 🔹 4. Create mapping
      await CategoryFranchiseSchema.create({
        category_id: category._id,
        franchise_id: franchise._id,
        display_order: item.displayOrder,
        is_active: true,
        is_deleted: false,
      });

      console.log(`✅ Created mapping ${item.categoryCode} - ${item.franchiseCode}`);
    }
  });
}
