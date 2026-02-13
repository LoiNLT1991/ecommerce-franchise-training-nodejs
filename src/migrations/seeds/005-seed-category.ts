import CategorySchema from "../../modules/category/category.model";
import { CATEGORY_CODE, SEED } from "../constants";
import { runMigration } from "../runner";

const DEFAULT_CATEGORIES = [
  {
    code: CATEGORY_CODE.COFFEE,
    name: "Coffee",
    description: "All coffee-based drinks",
    children: [
      {
        code: CATEGORY_CODE.VIETNAMESE_COFFEE,
        name: "Vietnamese Coffee",
        description: "Traditional Vietnamese coffee",
      },
      {
        code: CATEGORY_CODE.ESPRESSO,
        name: "Espresso Based",
        description: "Espresso-based drinks",
      },
    ],
  },
  { code: CATEGORY_CODE.TEA, name: "Tea", description: "Various types of tea" },
  { code: CATEGORY_CODE.ICE_BLENDED, name: "Ice Blended", description: "Iced blended drinks" },
  { code: CATEGORY_CODE.SMOOTHIE, name: "Smoothie", description: "Fruit blended drinks" },
  { code: CATEGORY_CODE.NON_COFFEE, name: "Non-Coffee", description: "Non-coffee beverages" },
  { code: CATEGORY_CODE.JUICE, name: "Juice", description: "Fresh fruit juices" },
  { code: CATEGORY_CODE.BAKERY_SNACK, name: "Bakery & Snack", description: "Baked goods and pastries" },
  { code: CATEGORY_CODE.TOPPING, name: "Topping", description: "Drink toppings" },
];

export async function seedCategoryMigration() {
  await runMigration(SEED.SEED_005_CATEGORY, async () => {
    for (const item of DEFAULT_CATEGORIES) {
      // 🔹 1. Check parent tồn tại chưa
      let parentDoc = await CategorySchema.findOne({ code: item.code });

      // 🔹 2. Nếu chưa tồn tại thì create và GÁN lại parentDoc
      if (!parentDoc) {
        parentDoc = await CategorySchema.create({
          code: item.code,
          name: item.name,
          description: item.description,
          parent_id: undefined,
          is_active: true,
          is_deleted: false,
        });

        console.log(`✅ Created category ${item.code}`);
      } else {
        console.log(`⏩ Category ${item.code} already exists`);
      }

      // 🔹 3. Insert children nếu có
      if (item.children?.length) {
        for (const child of item.children) {
          const existedChild = await CategorySchema.findOne({
            code: child.code,
          });

          if (existedChild) {
            console.log(`⏩ Category ${child.code} already exists`);
            continue;
          }

          await CategorySchema.create({
            code: child.code,
            name: child.name,
            description: child.description,
            parent_id: parentDoc._id, // 🔥 giờ chắc chắn có giá trị
            is_active: true,
            is_deleted: false,
          });

          console.log(`   ↳ Created child category ${child.code}`);
        }
      }
    }
  });
}
