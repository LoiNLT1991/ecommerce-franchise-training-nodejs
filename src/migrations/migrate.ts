import dotenv from "dotenv";
import mongoose from "mongoose";
import { seedUserMigration } from "./seeds/001-seed-user";
import { seedRoleMigration } from "./seeds/002-seed-role";
import { seedFranchiseMigration } from "./seeds/003-seed-franchise";
import { seedUserFranchiseRoleMigration } from "./seeds/004-seed-user-franchise-role";
import { seedCategoryMigration } from "./seeds/005-seed-category";
import { seedProductMigration } from "./seeds/007-seed-product";
import { seedCategoryFranchiseMigration } from "./seeds/006-seed-category-franchise";
import { seedProductFranchiseMigration } from "./seeds/008-seed-product-franchise";
import { seedProductCategoryFranchiseMigration } from "./seeds/009-seed-product-category-franchise";

dotenv.config();

async function migrate() {
  await mongoose.connect(process.env.MONGODB_URI!);

  console.log("📦 Connected to DB");

  await seedUserMigration();
  await seedRoleMigration();
  await seedFranchiseMigration();
  await seedUserFranchiseRoleMigration();
  await seedCategoryMigration();
  await seedProductMigration();
  await seedCategoryFranchiseMigration();
  await seedProductFranchiseMigration();
  await seedProductCategoryFranchiseMigration();

  console.log("🎉 All migrations completed");

  process.exit(0);
}

migrate();
