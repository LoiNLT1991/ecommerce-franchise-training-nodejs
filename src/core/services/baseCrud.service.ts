import { Document } from "mongoose";
import { MSG_BUSINESS } from "../constants";
import { HttpStatus } from "../enums";
import { HttpException } from "../exceptions";
import { BaseRepository } from "../repository";
import { SearchPaginationResponseModel } from "../models";
import { formatSearchPaginationResponse } from "../utils";

export abstract class BaseCrudService<T extends Document, CreateDto, UpdateDto, SearchDto> {
  protected constructor(protected readonly repo: BaseRepository<T>) {}

  protected async beforeCreate(dto: CreateDto, loggedUserId: string): Promise<void> {}
  protected async afterCreate(item: T, loggedUserId: string): Promise<void> {}

  protected async beforeUpdate(current: T, dto: UpdateDto, loggedUserId: string): Promise<void> {}
  protected async afterUpdate(oldItem: T, newItem: T, loggedUserId: string): Promise<void> {}

  protected async beforeDelete(item: T, loggedUserId: string): Promise<void> {}
  protected async afterDelete(item: T, loggedUserId: string): Promise<void> {}

  protected async beforeRestore(item: T, loggedUserId: string): Promise<void> {}
  protected async afterRestore(item: T, loggedUserId: string): Promise<void> {}

  // ===== CRUD (create/get/update/delete/restore) =====
  async create(dto: CreateDto, loggedUserId: string): Promise<T> {
    await this.beforeCreate(dto, loggedUserId);
    const item = await this.repo.create(dto as any);
    await this.afterCreate(item, loggedUserId);
    return item;
  }

  async getItem(id: string): Promise<T> {
    const item = await this.repo.findById(id);
    if (!item) {
      throw new HttpException(HttpStatus.BadRequest, MSG_BUSINESS.ITEM_NOT_FOUND);
    }
    return item;
  }

  async update(id: string, dto: UpdateDto, loggedUserId: string): Promise<T> {
    const current = await this.repo.findById(id);
    if (!current) throw new HttpException(HttpStatus.BadRequest, MSG_BUSINESS.ITEM_NOT_FOUND);
    await this.beforeUpdate(current, dto, loggedUserId);
    const updated = await this.repo.update(id, dto as any);
    await this.afterUpdate(current, updated, loggedUserId);
    return updated;
  }

  async softDelete(id: string, loggedUserId: string): Promise<void> {
    const item = await this.repo.findById(id);
    if (!item) throw new HttpException(HttpStatus.BadRequest, MSG_BUSINESS.ITEM_NOT_FOUND);
    await this.beforeDelete(item, loggedUserId);
    await this.repo.softDeleteById(id);
    await this.afterDelete(item, loggedUserId);
  }

  async restore(id: string, loggedUserId: string): Promise<void> {
    const item = await this.repo.findById(id, true);
    if (!item) throw new HttpException(HttpStatus.BadRequest, MSG_BUSINESS.ITEM_NOT_FOUND_OR_RESTORED);
    await this.beforeRestore(item, loggedUserId);
    await this.repo.restoreById(id);
    await this.afterRestore(item, loggedUserId);
  }
  // ===== END CRUD =====

  // ===== SEARCH TEMPLATE =====
  async getItems(searchDto: SearchDto): Promise<SearchPaginationResponseModel<T>> {
    const { data, total } = await this.doSearch(searchDto);
    const { pageNum, pageSize } = (searchDto as any).pageInfo;
    return formatSearchPaginationResponse(data, {
      pageNum,
      pageSize,
      totalItems: total,
      totalPages: Math.ceil(total / pageSize),
    });
  }

  // module MUST implement
  protected abstract doSearch(searchDto: SearchDto): Promise<{ data: T[]; total: number }>;
  // ===== END SEARCH TEMPLATE =====
}
