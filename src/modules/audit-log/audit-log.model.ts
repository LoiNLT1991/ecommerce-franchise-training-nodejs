import mongoose, { HydratedDocument, Schema } from "mongoose";
import { COLLECTION_NAME } from "../../core/constants";
import { BaseModelFields } from "../../core/models";
import { AuditAction, AuditLogFieldName } from "./audit-log.enum";
import { IAuditLog } from "./audit-log.interface";

const AuditLogSchemaEntity = new Schema({
  [AuditLogFieldName.ENTITY_TYPE]: { type: String, required: true },
  [AuditLogFieldName.ENTITY_ID]: { type: String, required: true },
  [AuditLogFieldName.ACTION]: { type: String, enum: Object.values(AuditAction), required: true },
  [AuditLogFieldName.OLD_DATA]: { type: Schema.Types.Mixed},
  [AuditLogFieldName.NEW_DATA]: { type: Schema.Types.Mixed },
  [AuditLogFieldName.CHANGED_BY]: { type: String, required: true },
  [AuditLogFieldName.NOTE]: { type: String },

  ...BaseModelFields,
});

export type AuditLogDocument = HydratedDocument<IAuditLog>;
const AuditLogSchema = mongoose.model<AuditLogDocument>(COLLECTION_NAME.AUDIT_LOG, AuditLogSchemaEntity);
export default AuditLogSchema;
