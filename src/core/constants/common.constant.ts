import { BaseRole, RoleScope } from "../enums";

export const ADMIN_EMAIL = "tamoki1110@gmail.com";

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
