import { BaseRole, RoleScope } from "../enums";

export const SUPER_ADMIN_EMAIL = process.env.SUPER_ADMIN_EMAIL;

export const ACCOUNT_DEFAULT = [
    process.env.SUPER_ADMIN_EMAIL,
    process.env.ADMIN_EMAIL,
    process.env.MANAGER_EMAIL,
    process.env.STAFF_EMAIL,
    process.env.ADMIN_EMAIL_GROUP_1,
    process.env.ADMIN_EMAIL_GROUP_2,
    process.env.ADMIN_EMAIL_GROUP_3,
    process.env.ADMIN_EMAIL_GROUP_4,
]

export const PASSWORD_LENGTH_MIN = 8;

export const PAGINATION = {
  pageNum: 1,
  pageSize: 10,
  totalItems: 0,
  totalPages: 0,
};

export const SYSTEM_ADMIN_ROLES = [{ scope: RoleScope.GLOBAL, roles: [BaseRole.SUPER_ADMIN, BaseRole.ADMIN] }];

export const SYSTEM_AND_FRANCHISE_MANAGER_ROLES = [
  { scope: RoleScope.GLOBAL, roles: [BaseRole.SUPER_ADMIN, BaseRole.ADMIN] },
  { scope: RoleScope.FRANCHISE, roles: [BaseRole.MANAGER] },
];

export const SYSTEM_AND_FRANCHISE_ALL_ROLES = [
  { scope: RoleScope.GLOBAL, roles: [BaseRole.SUPER_ADMIN, BaseRole.ADMIN] },
  { scope: RoleScope.FRANCHISE, roles: [BaseRole.MANAGER, BaseRole.STAFF] },
];
