import { BaseRole } from "../../core/enums";
import { RoleRepository } from "./role.repository";

export async function seedRoles() {
  const roleRepo = new RoleRepository();

  const defaultRoles = [
    {
      code: BaseRole.SUPER_ADMIN,
      name: "Super Admin",
      description: "System owner",
    },
    {
      code: BaseRole.ADMIN,
      name: "Admin",
      description: "System administrator",
    },
    {
      code: BaseRole.MANAGER,
      name: "Manager",
      description: "Franchise manager",
    },
    {
      code: BaseRole.STAFF,
      name: "Staff",
      description: "Franchise staff",
    },
    {
      code: BaseRole.SHIPPER,
      name: "Shipper",
      description: "Franchise shipper",
    },
    {
      code: BaseRole.USER,
      name: "User",
      description: "Normal user",
    },
  ];

  for (const role of defaultRoles) {
    const existed = await roleRepo.existsByField("code", role.code);
    if (!existed) {
      await roleRepo.create(role);
      console.log(`[SEED] Created role: ${role.code}`);
    }
  }
}
