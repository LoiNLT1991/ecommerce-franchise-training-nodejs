export const API_PATH = {
  // swagger api-docs
  API_DOCS: "/api-docs",

  // roles
  ROLE: "/api/roles",
  ROLE_MIGRATE: "/api/roles/migrate",
  ROLE_SELECT: "/api/roles/select",

  // audit logs
  AUDIT_LOG: "/api/audit-logs",
  AUDIT_LOG_ID: "/api/audit-logs/:id",
  AUDIT_LOG_SEARCH: "/api/audit-logs/search",
  AUDIT_LOG_SEARCH_BY_ENTITY: "/api/audit-logs/search-by-entity",

  // auth
  AUTH: "/api/auth",
  AUTH_REGISTER: "/api/auth/register",
  AUTH_LOGIN_SWAGGER: "/api/auth/login-swagger",
  AUTH_REFRESH_TOKEN: "/api/auth/refresh-token",
  AUTH_SWITCH_CONTEXT: "/api/auth/switch-context",
  AUTH_LOGOUT: "/api/auth/logout",
  AUTH_VERIFY_TOKEN: "/api/auth/verify-token",
  AUTH_RESEND_TOKEN: "/api/auth/resend-token",
  AUTH_FORGOT_PASSWORD: "/api/auth/forgot-password",
  AUTH_CHANGE_PASSWORD: "/api/auth/change-password",
  AUTH_TRIGGER_VERIFY_TOKEN: "/api/auth/trigger-verify-token",

  // franchises
  FRANCHISE: "/api/franchises",
  FRANCHISE_ID: "/api/franchises/:id",
  FRANCHISE_SEARCH: "/api/franchises/search",
  FRANCHISE_CHANGE_STATUS: "/api/franchises/:id/status",
  FRANCHISE_RESTORE: "/api/franchises/:id/restore",
  FRANCHISE_SELECT: "/api/franchises/select",

  // users
  USER: "/api/users",
  USER_ID: "/api/users/:id",
  USER_SEARCH: "/api/users/search",
  USER_CHANGE_STATUS: "/api/users/:id/change-status",
  USER_CHANGE_ROLE: "/api/users/:id/change-role",
  USER_ROLES: "/api/users/:id/roles",

  // user franchise roles
  USER_FRANCHISE_ROLE: "/api/user-franchise-roles",
  USER_FRANCHISE_ROLE_SEARCH: "/api/user-franchise-roles/search",
  USER_FRANCHISE_ROLE_ID: "/api/user-franchise-roles/:id",
  USER_FRANCHISE_ROLE_RESTORE: "/api/user-franchise-roles/:id/restore",

  // user franchise roles by user
  USER_FRANCHISE_ROLE_BY_USER_ID: "/api/user-franchise-roles/user/:userId",
};
