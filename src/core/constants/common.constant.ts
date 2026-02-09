import { BaseRole, RoleScope } from "../enums";

export const ADMIN_EMAIL = "tamoki1110@gmail.com";

export const PASSWORD_LENGTH_MIN = 8;

export const PAGINATION = {
  pageNum: 1,
  pageSize: 10,
  totalItems: 0,
  totalPages: 0,
};

export const BASE_ROLE_SYSTEM = [{ scope: RoleScope.GLOBAL, roles: [BaseRole.SUPER_ADMIN, BaseRole.ADMIN] }];

export const BASE_ROLE_SYSTEM_AND_FRANCHISE = [
  { scope: RoleScope.GLOBAL, roles: [BaseRole.SUPER_ADMIN, BaseRole.ADMIN] },
  { scope: RoleScope.FRANCHISE, roles: [BaseRole.MANAGER] },
];
