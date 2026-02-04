import { Document } from "mongoose";
import { IBase } from "../../core/interfaces";
import { AuditAction, AuditLogFieldName } from "./auditLog.enum";

export interface IAuditLog extends Document, IBase {
  [AuditLogFieldName.ENTITY_TYPE]: string;
  [AuditLogFieldName.ENTITY_ID]: string;
  [AuditLogFieldName.ACTION]: AuditAction;
  [AuditLogFieldName.OLD_DATA]?: Record<string, any>;
  [AuditLogFieldName.NEW_DATA]?: Record<string, any>;
  [AuditLogFieldName.CHANGED_BY]: string;
  [AuditLogFieldName.NOTE]?: string;
}

export interface IAuditLogPayload {
  entityType: string;
  entityId: string;
  action: AuditAction;
  oldData?: Record<string, any>;
  newData?: Record<string, any>;
  changedBy: string;
  note?: string;
}

export interface IAuditLogger {
  log(payload: IAuditLogPayload): Promise<void>;
}
