import { NextFunction, Request, Response } from "express";
import { HttpStatus } from "../enums";
import { IBaseCrudService } from "../interfaces";
import { AuthenticatedUserRequest } from "../models";
import { formatPaginationResponse, formatResponse } from "../utils";

export abstract class BaseCrudController<
  T,
  CreateDto,
  UpdateDto,
  SearchDto,
  ResponseDto,
  ServiceType extends IBaseCrudService<T, CreateDto, UpdateDto, SearchDto>,
> {
  protected readonly service: ServiceType;
  protected readonly mapToResponse: (item: T) => ResponseDto;

  protected constructor(service: ServiceType, mapToResponse: (item: T) => ResponseDto) {
    this.service = service;
    this.mapToResponse = mapToResponse;
  }

  createItem = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const item = await this.service.create(req.body, (req as AuthenticatedUserRequest).user.id);
      res.status(HttpStatus.Success).json(formatResponse(this.mapToResponse(item)));
    } catch (error) {
      next(error);
    }
  };

  // ===== Search / Get Items =====
  getItems = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.getItems(req.body);
      res
        .status(HttpStatus.Success)
        .json(formatPaginationResponse(result.pageData.map(this.mapToResponse), result.pageInfo));
    } catch (error) {
      next(error);
    }
  };

  getItem = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const item = await this.service.getItem(req.params.id);
      res.status(HttpStatus.Success).json(formatResponse(this.mapToResponse(item)));
    } catch (error) {
      next(error);
    }
  };

  updateItem = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const item = await this.service.update(req.params.id, req.body, (req as AuthenticatedUserRequest).user.id);
      res.status(HttpStatus.Success).json(formatResponse(this.mapToResponse(item)));
    } catch (error) {
      next(error);
    }
  };

  softDeleteItem = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.service.softDelete(req.params.id, (req as AuthenticatedUserRequest).user.id);
      res.status(HttpStatus.Success).json(formatResponse(null));
    } catch (error) {
      next(error);
    }
  };

  restoreItem = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.service.restore(req.params.id, (req as AuthenticatedUserRequest).user.id);
      res.status(HttpStatus.Success).json(formatResponse(null));
    } catch (error) {
      next(error);
    }
  };
}
