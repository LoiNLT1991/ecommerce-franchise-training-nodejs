import { GLOBAL_FRANCHISE_ID } from "../../core";
import FranchiseSchema from "../../modules/franchise/franchise.model";
import { FRANCHISE_CODE, SEED } from "../constants";
import { runMigration } from "../runner";

const DEFAULT_FRANCHISES = [
  { code: FRANCHISE_CODE.HL001, name: "High Land 001", opened_at: "08:00", closed_at: "22:00" },
  { code: FRANCHISE_CODE.HL002, name: "High Land 002", opened_at: "09:00", closed_at: "23:00" },
  { code: FRANCHISE_CODE.TN001, name: "Trung Nguyen 001", opened_at: "08:00", closed_at: "22:00" },
  { code: FRANCHISE_CODE.TN002, name: "Trung Nguyen 002", opened_at: "09:00", closed_at: "23:00" },
];

export async function seedFranchiseMigration() {
  await runMigration(SEED.SEED_003_FRANCHISE, async () => {
    for (const item of DEFAULT_FRANCHISES) {
      const existed = await FranchiseSchema.findOne({
        code: item.code,
      });

      if (existed) {
        console.log(`⏩ Franchise ${item.code} already exists`);
        continue;
      }

      await FranchiseSchema.create({
        code: item.code,
        name: item.name,
        opened_at: item.opened_at,
        closed_at: item.closed_at,
        is_active: true,
      });

      console.log(`✅ Created franchise ${item.code}`);
    }
  });
}
