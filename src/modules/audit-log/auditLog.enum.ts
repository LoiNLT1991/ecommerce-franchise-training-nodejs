export enum AuditLogFieldName {
  ENTITY_TYPE = "entity_type", // order / product / user...
  ENTITY_ID = "entity_id",
  ACTION = "action", // CREATE / UPDATE / DELETE / SOFT_DELETE / RESTORE / OTHER
  OLD_DATA = "old_data", // json
  NEW_DATA = "new_data", // json
  CHANGED_BY = "changed_by",
  NOTE = "note",
}

export enum AuditAction {
  CREATE = "CREATE",
  UPDATE = "UPDATE",
  DELETE = "DELETE",
  SOFT_DELETE = "SOFT_DELETE",
  RESTORE = "RESTORE",
  CHANGE_STATUS = "CHANGE_STATUS",
  OTHER = "OTHER",
}

export enum AuditEntityType {
  FRANCHISE = "FRANCHISE",
  USER = "USER",
  ROLE = "ROLE",
  CATEGORY = "CATEGORY",
  PRODUCT = "PRODUCT",
  ORDER = "ORDER",
}
