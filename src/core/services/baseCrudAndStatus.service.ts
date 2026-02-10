import { HydratedDocument } from "mongoose";
import { MSG_BUSINESS } from "../constants";
import { HttpStatus } from "../enums";
import { HttpException } from "../exceptions";
import { BaseCrudService } from "./baseCrud.service";

export interface IActivatable {
  is_active: boolean;
}

export abstract class BaseStatusCrudService<
  T extends HydratedDocument<IActivatable>,
  CreateDto,
  UpdateDto,
  SearchDto,
> extends BaseCrudService<T, CreateDto, UpdateDto, SearchDto> {
  protected async beforeChangeStatus(item: T, loggedUserId: string): Promise<void> {}
  protected async afterChangeStatus(item: T, loggedUserId: string): Promise<void> {}

  async changeStatus(id: string, is_active: boolean, loggedUserId: string): Promise<void> {
    const currentItem = await this.repo.findById(id);
    if (!currentItem) {
      throw new HttpException(HttpStatus.NotFound, MSG_BUSINESS.ITEM_NOT_FOUND);
    }

    if (currentItem.is_active === is_active) {
      throw new HttpException(HttpStatus.BadRequest, MSG_BUSINESS.STATUS_NO_CHANGE);
    }

    await this.beforeChangeStatus(currentItem, loggedUserId);

    await this.repo.update(id, { is_active } as any);

    const updatedItem = await this.repo.findById(id);
    if (updatedItem) {
      await this.afterChangeStatus(updatedItem, loggedUserId);
    }
  }
}
