import mongoose, { Types } from "mongoose";
import dotenv from "dotenv";
import ProductFranchiseSchema from "../../modules/product-franchise/product-franchise.model";
import InventorySchema from "../../modules/inventory/inventory.model";

dotenv.config();

async function seedInventory(franchiseId: string) {
  console.log("🚀 Seeding inventory for franchise:", franchiseId);

  const franchiseObjectId = new Types.ObjectId(franchiseId);

  const productFranchises = await ProductFranchiseSchema.find({
    franchise_id: franchiseObjectId,
  }).lean();

  if (!productFranchises.length) {
    console.log("⚠️ No product found for this franchise");
    return;
  }

  const bulkOps = productFranchises.map((pf) => ({
    updateOne: {
      filter: {
        product_franchise_id: pf._id,
      },
      update: {
        $setOnInsert: {
          product_franchise_id: pf._id,
          quantity: 100,
          reserved_quantity: 0,
          alert_threshold: 10,
        },
      },
      upsert: true,
    },
  }));

  await InventorySchema.bulkWrite(bulkOps);

  console.log(`✅ Processed ${bulkOps.length} inventory records`);
}

async function main() {
  const franchiseId = process.argv[2];

  if (!franchiseId) {
    console.error("❌ Please provide franchiseId");
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGODB_URI!);
  console.log("📦 Connected to DB");

  await seedInventory(franchiseId);

  console.log("🎉 Done");
  process.exit(0);
}

main();
