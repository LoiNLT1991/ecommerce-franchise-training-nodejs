import { BaseRole, RoleScope } from "../../core";
import RoleSchema from "../../modules/role/role.model";
import { SEED } from "../constants";
import { runMigration } from "../runner";

const DEFAULT_ROLES = [
  { code: BaseRole.SUPER_ADMIN, name: "Super Admin", scope: RoleScope.GLOBAL },
  { code: BaseRole.ADMIN, name: "Admin", scope: RoleScope.GLOBAL },
  { code: BaseRole.MANAGER, name: "Manager", scope: RoleScope.FRANCHISE },
  { code: BaseRole.STAFF, name: "Staff", scope: RoleScope.FRANCHISE },
  { code: BaseRole.SHIPPER, name: "Shipper", scope: RoleScope.FRANCHISE },
  { code: BaseRole.USER, name: "User", scope: RoleScope.FRANCHISE },
];

export async function seedRoleMigration() {
  await runMigration(SEED.SEED_002_ROLE, async () => {
    for (const item of DEFAULT_ROLES) {
      const existed = await RoleSchema.findOne({
        code: item.code,
      });

      if (existed) {
        console.log(`⏩ Role ${item.code} already exists`);
        continue;
      }

      await RoleSchema.create({
        code: item.code,
        name: item.name,
        scope: item.scope,
        is_active: true,
      });

      console.log(`✅ Created role ${item.code}`);
    }
  });
}
