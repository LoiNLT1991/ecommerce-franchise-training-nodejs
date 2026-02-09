import { NextFunction, Request, Response } from "express";
import { HttpStatus } from "../../core/enums";
import { formatPaginationResponse, formatResponse } from "../../core/utils";
import { IAuditLog } from "./audit-log.interface";
import AuditLogService from "./audit-log.service";
import { SearchAuditLogByEntityDto, SearchPaginationItemDto } from "./dto/search.dto";

export default class AuditLogController {
  constructor(private readonly service: AuditLogService) {}

  public getItem = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const item: IAuditLog = await this.service.getItem(id);
      res.status(HttpStatus.Success).json(formatResponse<IAuditLog>(item));
    } catch (error) {
      next(error);
    }
  };

  public getItems = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payload: SearchPaginationItemDto = req.body;
      const result = await this.service.getItems(payload);
      res.status(HttpStatus.Success).json(formatPaginationResponse<IAuditLog>(result.pageData, result.pageInfo));
    } catch (error) {
      next(error);
    }
  };

  public getLogsByEntity = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payload: SearchAuditLogByEntityDto = req.body;
      const logs = await this.service.getLogsByEntity(payload);
      res.status(HttpStatus.Success).json(formatResponse<IAuditLog[]>(logs));
    } catch (error) {
      next(error);
    }
  };
}
