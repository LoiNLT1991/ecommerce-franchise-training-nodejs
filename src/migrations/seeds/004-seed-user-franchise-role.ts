import { BaseRole, RoleScope } from "../../core";
import FranchiseSchema from "../../modules/franchise/franchise.model";
import RoleSchema from "../../modules/role/role.model";
import UserFranchiseRoleSchema from "../../modules/user-franchise-role/user-franchise-role.model";
import UserSchema from "../../modules/user/user.model";
import { FRANCHISE_CODE, SEED } from "../constants";
import { runMigration } from "../runner";

const USER_ROLE_ASSIGNMENTS = [
  {
    email: process.env.SUPER_ADMIN_EMAIL,
    role_code: BaseRole.SUPER_ADMIN,
    franchise_code: RoleScope.GLOBAL,
  },
  {
    email: process.env.ADMIN_EMAIL,
    role_code: BaseRole.ADMIN,
    franchise_code: RoleScope.GLOBAL,
  },
  {
    email: process.env.MANAGER_EMAIL,
    role_code: BaseRole.MANAGER,
    franchise_code: FRANCHISE_CODE.HL001,
  },
  {
    email: process.env.MANAGER_EMAIL,
    role_code: BaseRole.MANAGER,
    franchise_code: FRANCHISE_CODE.TN001,
  },
  {
    email: process.env.STAFF_EMAIL,
    role_code: BaseRole.STAFF,
    franchise_code: FRANCHISE_CODE.HL001,
  },
  {
    email: process.env.STAFF_EMAIL,
    role_code: BaseRole.STAFF,
    franchise_code: FRANCHISE_CODE.TN001,
  },
  {
    email: process.env.ADMIN_EMAIL_GROUP_1,
    role_code: BaseRole.ADMIN,
    franchise_code: RoleScope.GLOBAL,
  },
  {
    email: process.env.ADMIN_EMAIL_GROUP_2,
    role_code: BaseRole.ADMIN,
    franchise_code: RoleScope.GLOBAL,
  },
  {
    email: process.env.ADMIN_EMAIL_GROUP_3,
    role_code: BaseRole.ADMIN,
    franchise_code: RoleScope.GLOBAL,
  },
  {
    email: process.env.ADMIN_EMAIL_GROUP_4,
    role_code: BaseRole.ADMIN,
    franchise_code: RoleScope.GLOBAL,
  },
];

export async function seedUserFranchiseRoleMigration() {
  await runMigration(SEED.SEED_004_USER_FRANCHISE_ROLE, async () => {
    for (const item of USER_ROLE_ASSIGNMENTS) {
      if (!item.email) continue;

      // 🔹 1. Find user
      const user = await UserSchema.findOne({ email: item.email });
      if (!user) {
        console.log(`❌ User ${item.email} not found`);
        continue;
      }

      // 🔹 2. Find role
      const role = await RoleSchema.findOne({ code: item.role_code });
      if (!role) {
        console.log(`❌ Role ${item.role_code} not found`);
        continue;
      }

      // 🔹 3. Determine franchise_id based on role scope
      let franchiseId: any = undefined;

      if (role.scope === RoleScope.FRANCHISE) {
        if (!item.franchise_code) {
          console.log(`❌ Franchise code required for role ${role.code}`);
          continue;
        }

        const franchise = await FranchiseSchema.findOne({
          code: item.franchise_code,
        });

        if (!franchise) {
          console.log(`❌ Franchise ${item.franchise_code} not found`);
          continue;
        }

        franchiseId = franchise._id;
      }

      // 🔹 4. Check duplicate
      const existed = await UserFranchiseRoleSchema.findOne({
        user_id: user._id,
        role_id: role._id,
        ...(franchiseId ? { franchise_id: franchiseId } : {}),
        is_deleted: false,
      });

      if (existed) {
        console.log(`⏩ Assignment exists for ${item.email}`);
        continue;
      }

      // 🔹 5. Create assignment
      await UserFranchiseRoleSchema.create({
        user_id: user._id,
        role_id: role._id,
        ...(franchiseId ? { franchise_id: franchiseId } : {}),
        is_active: true,
      });

      console.log(`✅ Assigned ${item.role_code} to ${item.email}`);
    }
  });
}
