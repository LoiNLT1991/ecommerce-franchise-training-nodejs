import { Router } from "express";
import { API_PATH } from "../../core/constants";
import { IRoute } from "../../core/interfaces";
import { authMiddleware, validationMiddleware } from "../../core/middleware";
import AuditLogController from "./audit-log.controller";
import { SearchAuditLogByEntityDto, SearchPaginationItemDto } from "./dto/search.dto";

export default class AuditLogRoute implements IRoute {
  public path = API_PATH.AUDIT_LOG;
  public router = Router();

  constructor(private readonly controller: AuditLogController) {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    /**
     * @swagger
     * tags:
     *   - name: AuditLog
     *     description: AuditLog related endpoints
     */

    // GET domain:/api/audit-logs/:id - Get audit log by id
    this.router.get(API_PATH.AUDIT_LOG_ID, authMiddleware(), this.controller.getItem);

    // POST domain:/api/audit-logs/search - Get all audit logs
    this.router.post(
      API_PATH.AUDIT_LOG_SEARCH,
      authMiddleware(),
      validationMiddleware(SearchPaginationItemDto, true, {
        enableImplicitConversion: false,
      }),
      this.controller.getItems,
    );

    // POST domain:/api/audit-logs/search-by-entity - Get all audit logs by entity
    this.router.post(
      API_PATH.AUDIT_LOG_SEARCH_BY_ENTITY,
      authMiddleware(),
      validationMiddleware(SearchAuditLogByEntityDto, true, {
        enableImplicitConversion: false,
      }),
      this.controller.getLogsByEntity,
    );
  }
}
