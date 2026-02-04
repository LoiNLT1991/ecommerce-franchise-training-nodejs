export interface AuditLogResponseDto {
  id: string;
  entity_type: string;
  entity_id: string;
  action: string;
  old_data: Record<string, any>;
  new_data: Record<string, any>;
  change_by: Record<string, any>;
  note: string;
  created_at: string;
  updated_at: string;
}
