import FranchiseSchema from "../../modules/franchise/franchise.model";
import ProductFranchiseSchema from "../../modules/product-franchise/product-franchise.model";
import ProductSchema from "../../modules/product/product.model";
import { FRANCHISE_CODE, PRODUCT_CODE, SEED } from "../constants";
import { runMigration } from "../runner";

const DEFAULT_PRODUCT_FRANCHISE = [
  { productCode: PRODUCT_CODE.ESP001, franchiseCode: FRANCHISE_CODE.HL001, SIZE: "S", PRICE_BASE: 30000 },
  { productCode: PRODUCT_CODE.ESP001, franchiseCode: FRANCHISE_CODE.HL001, SIZE: "M", PRICE_BASE: 40000 },
  { productCode: PRODUCT_CODE.ESP001, franchiseCode: FRANCHISE_CODE.HL001, SIZE: "L", PRICE_BASE: 50000 },
  { productCode: PRODUCT_CODE.ESP002, franchiseCode: FRANCHISE_CODE.HL001, SIZE: "S", PRICE_BASE: 30000 },
  { productCode: PRODUCT_CODE.ESP002, franchiseCode: FRANCHISE_CODE.HL001, SIZE: "M", PRICE_BASE: 40000 },
  { productCode: PRODUCT_CODE.ESP002, franchiseCode: FRANCHISE_CODE.HL001, SIZE: "L", PRICE_BASE: 50000 },

  { productCode: PRODUCT_CODE.VCOF001, franchiseCode: FRANCHISE_CODE.HL001, SIZE: "S", PRICE_BASE: 30000 },
  { productCode: PRODUCT_CODE.VCOF001, franchiseCode: FRANCHISE_CODE.HL001, SIZE: "M", PRICE_BASE: 40000 },
  { productCode: PRODUCT_CODE.VCOF001, franchiseCode: FRANCHISE_CODE.HL001, SIZE: "L", PRICE_BASE: 50000 },

  { productCode: PRODUCT_CODE.TEA001, franchiseCode: FRANCHISE_CODE.HL001, SIZE: "S", PRICE_BASE: 30000 },
  { productCode: PRODUCT_CODE.TEA001, franchiseCode: FRANCHISE_CODE.HL001, SIZE: "M", PRICE_BASE: 40000 },
  { productCode: PRODUCT_CODE.TEA001, franchiseCode: FRANCHISE_CODE.HL001, SIZE: "L", PRICE_BASE: 50000 },

  { productCode: PRODUCT_CODE.ICE001, franchiseCode: FRANCHISE_CODE.HL001, SIZE: "S", PRICE_BASE: 30000 },
  { productCode: PRODUCT_CODE.ICE001, franchiseCode: FRANCHISE_CODE.HL001, SIZE: "M", PRICE_BASE: 40000 },
  { productCode: PRODUCT_CODE.ICE001, franchiseCode: FRANCHISE_CODE.HL001, SIZE: "L", PRICE_BASE: 50000 },

  { productCode: PRODUCT_CODE.SMT001, franchiseCode: FRANCHISE_CODE.HL001, SIZE: "S", PRICE_BASE: 30000 },
  { productCode: PRODUCT_CODE.SMT001, franchiseCode: FRANCHISE_CODE.HL001, SIZE: "M", PRICE_BASE: 40000 },
  { productCode: PRODUCT_CODE.SMT001, franchiseCode: FRANCHISE_CODE.HL001, SIZE: "L", PRICE_BASE: 50000 },

  { productCode: PRODUCT_CODE.TTHK001, franchiseCode: FRANCHISE_CODE.HL001, SIZE: null, PRICE_BASE: 10000 },
  { productCode: PRODUCT_CODE.TTD001, franchiseCode: FRANCHISE_CODE.HL001, SIZE: null, PRICE_BASE: 10000 },
  { productCode: PRODUCT_CODE.PLAN001, franchiseCode: FRANCHISE_CODE.HL001, SIZE: null, PRICE_BASE: 15000 },

  { productCode: PRODUCT_CODE.ESP001, franchiseCode: FRANCHISE_CODE.TN001, SIZE: "S", PRICE_BASE: 32000 },
  { productCode: PRODUCT_CODE.ESP001, franchiseCode: FRANCHISE_CODE.TN001, SIZE: "M", PRICE_BASE: 42000 },
  { productCode: PRODUCT_CODE.ESP001, franchiseCode: FRANCHISE_CODE.TN001, SIZE: "L", PRICE_BASE: 52000 },
  { productCode: PRODUCT_CODE.ESP002, franchiseCode: FRANCHISE_CODE.TN001, SIZE: "S", PRICE_BASE: 32000 },
  { productCode: PRODUCT_CODE.ESP002, franchiseCode: FRANCHISE_CODE.TN001, SIZE: "M", PRICE_BASE: 42000 },
  { productCode: PRODUCT_CODE.ESP002, franchiseCode: FRANCHISE_CODE.TN001, SIZE: "L", PRICE_BASE: 52000 },

  { productCode: PRODUCT_CODE.VCOF001, franchiseCode: FRANCHISE_CODE.TN001, SIZE: "S", PRICE_BASE: 30000 },
  { productCode: PRODUCT_CODE.VCOF001, franchiseCode: FRANCHISE_CODE.TN001, SIZE: "M", PRICE_BASE: 40000 },
  { productCode: PRODUCT_CODE.VCOF001, franchiseCode: FRANCHISE_CODE.TN001, SIZE: "L", PRICE_BASE: 50000 },

  { productCode: PRODUCT_CODE.TTHK001, franchiseCode: FRANCHISE_CODE.TN001, SIZE: null, PRICE_BASE: 15000 },
  { productCode: PRODUCT_CODE.TTD001, franchiseCode: FRANCHISE_CODE.TN001, SIZE: null, PRICE_BASE: 15000 },
  { productCode: PRODUCT_CODE.PLAN001, franchiseCode: FRANCHISE_CODE.TN001, SIZE: null, PRICE_BASE: 20000 },
];

export async function seedProductFranchiseMigration() {
  await runMigration(SEED.SEED_008_PRODUCT_FRANCHISE, async () => {
    for (const item of DEFAULT_PRODUCT_FRANCHISE) {
      // 🔹 1. Lấy product theo SKU
      const product = await ProductSchema.findOne({
        SKU: item.productCode,
      });

      if (!product) {
        console.log(`❌ Product ${item.productCode} not found`);
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

      // 🔹 3. Normalize size (nếu undefined → null)
      const size = item.SIZE ?? null;

      // 🔹 4. Check mapping tồn tại chưa
      const existed = await ProductFranchiseSchema.findOne({
        product_id: product._id,
        franchise_id: franchise._id,
        size: size,
      });

      if (existed) {
        console.log(`⏩ Mapping ${item.productCode} - ${item.franchiseCode} - ${size ?? "NO_SIZE"} already exists`);
        continue;
      }

      // 🔹 5. Create mapping
      await ProductFranchiseSchema.create({
        product_id: product._id,
        franchise_id: franchise._id,
        size: size,
        price_base: item.PRICE_BASE,
        is_active: true,
        is_deleted: false,
      });

      console.log(`✅ Created mapping ${item.productCode} - ${item.franchiseCode} - ${size ?? "NO_SIZE"}`);
    }
  });
}
