import { encodePassword } from "../../core";
import UserSchema from "../../modules/user/user.model";
import { SEED } from "../constants";
import { runMigration } from "../runner";

const DEFAULT_USERS = [
  { email: process.env.SUPER_ADMIN_EMAIL!, password: process.env.DEFAULT_PASSWORD!, name: "Super Admin" },
  { email: process.env.ADMIN_EMAIL!, password: process.env.DEFAULT_PASSWORD!, name: "Admin" },
  { email: process.env.MANAGER_EMAIL!, password: process.env.DEFAULT_PASSWORD!, name: "Manager Franchise" },
  { email: process.env.STAFF_EMAIL!, password: process.env.DEFAULT_PASSWORD!, name: "Staff Franchise" },
  { email: process.env.ADMIN_EMAIL_GROUP_1, password: process.env.DEFAULT_PASSWORD!, name: "Super Admin - Group 01" },
  { email: process.env.ADMIN_EMAIL_GROUP_2, password: process.env.DEFAULT_PASSWORD!, name: "Super Admin - Group 02" },
  { email: process.env.ADMIN_EMAIL_GROUP_3, password: process.env.DEFAULT_PASSWORD!, name: "Super Admin - Group 03" },
  { email: process.env.ADMIN_EMAIL_GROUP_4, password: process.env.DEFAULT_PASSWORD!, name: "Super Admin - Group 04" },
];

export async function seedUserMigration() {
  await runMigration(SEED.SEED_001_USER, async () => {
    for (const item of DEFAULT_USERS) {
      const existed = await UserSchema.findOne({
        email: item.email,
      });

      if (existed) {
        console.log(`⏩ User ${item.email} already exists`);
        continue;
      }

      const hashedPassword = await encodePassword(item.password);

      await UserSchema.create({
        email: item.email,
        password: hashedPassword,
        name: item.name,
        is_active: true,
        is_verified: true,
        verification_token: null,
        verification_token_expires: null,
      });

      console.log(`✅ Created user ${item.email}`);
    }
  });
}
