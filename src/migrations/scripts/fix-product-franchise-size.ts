import mongoose from "mongoose";
import dotenv from "dotenv";
import ProductFranchiseSchema from "../../modules/product-franchise/product-franchise.model";

dotenv.config();

async function fixSizeField() {
  console.log("🚀 Fixing ProductFranchise size field...");

  const result = await ProductFranchiseSchema.updateMany(
    {
      $or: [
        { size: null },
        { size: { $exists: false } },
      ],
    },
    {
      $set: { size: "DEFAULT" },
    }
  );

  console.log(`✅ Updated ${result.modifiedCount} documents`);
}

async function main() {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log("📦 Connected to DB");

    await fixSizeField();

    console.log("🎉 Done");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

main();