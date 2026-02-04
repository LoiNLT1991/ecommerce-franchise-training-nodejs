import { MSG_BUSINESS } from "../../core/constants";
import { HttpStatus } from "../../core/enums";
import { HttpException } from "../../core/exceptions";
import { SearchPaginationResponseModel } from "../../core/models";
import { formatSearchPaginationResponse } from "../../core/utils";
import { IAuditLog, IAuditLogger, IAuditLogPayload } from "./auditLog.interface";
import { AuditLogRepository } from "./auditLog.repository";
import { SearchAuditLogByEntityDto, SearchPaginationItemDto } from "./dto/search.dto";

export default class AuditLogService implements IAuditLogger {
  constructor(private readonly repo: AuditLogRepository) {}

  public async log(payload: IAuditLogPayload): Promise<void> {
    const logData = {
      entity_type: payload.entityType,
      entity_id: payload.entityId,
      action: payload.action,
      old_data: payload.oldData,
      new_data: payload.newData,
      changed_by: payload.changedBy,
      note: payload.note,
    };
    await this.repo.create(logData);
  }

  public async getItem(id: string): Promise<IAuditLog> {
    const item = await this.repo.getDetailWithUser(id);
    if (!item) {
      throw new HttpException(HttpStatus.BadRequest, MSG_BUSINESS.ITEM_NOT_FOUND);
    }
    return item;
  }

  public async getItems(payload: SearchPaginationItemDto): Promise<SearchPaginationResponseModel<IAuditLog>> {
    const { data, total } = await this.repo.getItems(payload);
    const { pageNum, pageSize } = payload.pageInfo;

    return formatSearchPaginationResponse(data, {
      pageNum,
      pageSize,
      totalItems: total,
      totalPages: Math.ceil(total / pageSize),
    });
  }

  public async getLogsByEntity(payload: SearchAuditLogByEntityDto): Promise<IAuditLog[]> {
    return this.repo.getLogsByEntity(payload);
  }
}
