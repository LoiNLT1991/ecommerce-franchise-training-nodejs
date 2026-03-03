import { BaseCrudService, BaseFieldName, checkEmptyObject, HttpException, HttpStatus, IError, MSG_BUSINESS } from "../../core";
import { IShiftAssignment, IShiftAssignmentQuery } from "./shift-assignment.interface";
import { CreateShiftAssignmentDto } from "./dto/create.dto";
import { UpdateShiftAssignmentDto } from "./dto/update.dto";
import { ShiftAssignmentRepository } from "./shift-assignment.repository";
import { AuditAction, AuditEntityType, buildAuditDiff, IAuditLogger } from "../audit-log";
import { SearchPaginationItemDto } from "./dto/search.dto";
import { Types } from "mongoose";
import { ShiftAssignmentStatus } from "../../core/enums/base.enum";
import { ShiftRepository } from "../shift/shift.repository";
import { UserRepository } from "../user/user.repository";
import { IShiftQuery } from "../shift/shift.interface";
import { IUserQuery } from "../user/user.interface";
export const AUDIT_FIELDS_ITEM=[
  BaseFieldName.USER_ID,
  BaseFieldName.SHIFT_ID,
  BaseFieldName.WORK_DATE,
  BaseFieldName.FRANCHISE_ID,
  BaseFieldName.ASSIGNED_BY,
  BaseFieldName.STATUS,
] as readonly (keyof IShiftAssignment)[];

export class ShiftAssignmentService extends BaseCrudService<IShiftAssignment,CreateShiftAssignmentDto,UpdateShiftAssignmentDto,SearchPaginationItemDto> {
  private readonly shiftAssignRepo: ShiftAssignmentRepository
  
  
  constructor(repo:ShiftAssignmentRepository, 
    private readonly shiftQuery:IShiftQuery,
    private readonly userQuery:IUserQuery,
    private readonly auditLogger:IAuditLogger) {
    super(repo);
    this.shiftAssignRepo = repo;
  }

  public async beforeCreate(dto: CreateShiftAssignmentDto): Promise<void> {
    await checkEmptyObject(dto);

    const errors: IError[] = [];

    // Check if a shift assignment already exists for the same user on the same work date
    const isExist = await this.repo.existsByFilter({
      [BaseFieldName.USER_ID]: new Types.ObjectId(dto.user_id),
      [BaseFieldName.WORK_DATE]: dto.work_date,
      [BaseFieldName.SHIFT_ID]: new Types.ObjectId(dto.shift_id),
    });
    const shift = await this.shiftQuery.getById(dto.shift_id);
    const user = await this.userQuery.getUserById(dto.user_id);
    if (!shift) {
      errors.push({
        field: BaseFieldName.SHIFT_ID,
        message: MSG_BUSINESS.ITEM_NOT_FOUND_WITH_NAME("Shift"),
      });
    }
    if (!user) {
      errors.push({
        field: BaseFieldName.USER_ID,
        message: MSG_BUSINESS.ITEM_NOT_FOUND_WITH_NAME("User"),
      });
    }


    if (isExist) {
      errors.push({
        field: BaseFieldName.WORK_DATE,
        message: MSG_BUSINESS.ITEM_EXISTS(`Shift assignment for user on work date '${dto.work_date}'`),
      });
    }

    if (errors.length) {
      throw new HttpException(HttpStatus.BadRequest, "", errors);
    }
    
  }
  public async afterCreate(item: IShiftAssignment, loggedUserId: string): Promise<void> {
    await this.auditLogger.log({
      entityType: AuditEntityType.SHIFT_ASSIGNMENT,
      entityId: String(item._id),
      action: AuditAction.CREATE,
      newData: item,
      changedBy: loggedUserId,
    });
  }

  public async beforeUpdate(current: IShiftAssignment, payload: UpdateShiftAssignmentDto, loggedUserId: string): Promise<void> {
    await checkEmptyObject(payload);

    const errors: IError[] = [];

    // Check if a shift assignment already exists for the same user on the same work date (exclude self)
    const isExist = await this.repo.existsByFilter({
      [BaseFieldName.USER_ID]: new Types.ObjectId(payload.user_id ?? current.user_id),
      [BaseFieldName.WORK_DATE]: payload.work_date ?? current.work_date,
      _id: { $ne: current._id },
    });
    if (isExist) {
      errors.push({
        field: BaseFieldName.WORK_DATE,
        message: MSG_BUSINESS.ITEM_EXISTS(`Shift assignment for user on work date '${payload.work_date ?? current.work_date}'`),
      });
    }
    if (payload.status !== undefined) {
      const isValidStatus = Object.values(ShiftAssignmentStatus)
          .includes(payload.status as ShiftAssignmentStatus);

      if (!isValidStatus) {
          throw new HttpException(
            HttpStatus.BadRequest,
            "Invalid status value"
          );
      }
    }

    if (errors.length) {
      throw new HttpException(HttpStatus.BadRequest, "", errors);
    }


    const hasChange = (Object.keys(payload) as (keyof UpdateShiftAssignmentDto)[]).some((key) => payload[key] !== current[key]);

    if (!hasChange) {
      throw new HttpException(HttpStatus.BadRequest, MSG_BUSINESS.NO_DATA_TO_UPDATE);
    }
  }

  public async beforeDelete(item: IShiftAssignment): Promise<void> {
    const isExist = await this.repo.existsByFilter({
      [BaseFieldName.USER_ID]: new Types.ObjectId(item.user_id),
      [BaseFieldName.WORK_DATE]: item.work_date,
      _id: { $ne: item._id },
    });
    if (isExist) {
      throw new HttpException(HttpStatus.BadRequest, MSG_BUSINESS.ITEM_EXISTS(`Shift assignment for user on work date '${item.work_date}'`));
    }
  }

  public async beforeRestore(item: IShiftAssignment): Promise<void> {
    const isExist = await this.repo.existsByFilter({
      [BaseFieldName.USER_ID]: new Types.ObjectId(item.user_id),
      [BaseFieldName.WORK_DATE]: item.work_date,
      _id: { $ne: item._id },
    });
    if (isExist) {
      throw new HttpException(HttpStatus.BadRequest, MSG_BUSINESS.ITEM_EXISTS(`Shift assignment for user on work date '${item.work_date}'`));
    }
  }


  public async afterUpdate(oldItem: IShiftAssignment, newItem: IShiftAssignment, loggedUserId: string): Promise<void> {
    const { oldData, newData } = buildAuditDiff(oldItem, newItem, AUDIT_FIELDS_ITEM);

    if (newData && Object.keys(newData).length > 0) {
      await this.auditLogger.log({
        entityType: AuditEntityType.SHIFT_ASSIGNMENT,
        entityId: String(oldItem._id),
        action: AuditAction.UPDATE,
        oldData,
        newData,
        changedBy: loggedUserId,
      });
    }
  }

  public async afterDelete(item: IShiftAssignment, loggedUserId: string): Promise<void> {
    await this.auditLogger.log({
      entityType: AuditEntityType.SHIFT_ASSIGNMENT,
      entityId: String(item._id),
      action: AuditAction.SOFT_DELETE,
      oldData: { is_deleted: false },
      newData: { is_deleted: true },
      changedBy: loggedUserId,
    });
  }

  public async afterRestore(item: IShiftAssignment, loggedUserId: string): Promise<void> {
    await this.auditLogger.log({
      entityType: AuditEntityType.SHIFT_ASSIGNMENT,
      entityId: String(item._id),
      action: AuditAction.RESTORE,
      oldData: { is_deleted: true },
      newData: { is_deleted: false },
      changedBy: loggedUserId,
    });
  }


  public async doSearch(model: SearchPaginationItemDto): Promise<{ data: IShiftAssignment[]; total: number }> {
    return this.shiftAssignRepo.getItems(model);
  }

  public async getById(id: string): Promise<IShiftAssignment | null> {
    return this.shiftAssignRepo.getById(id);
  }

public async changeStatus(id: string, model: UpdateShiftAssignmentDto, loggedUserId: string): Promise<void> {
    const { status } = model;

    // 1. Get item
    const currentItem = await this.repo.findById(id);
    if (!currentItem) {
      throw new HttpException(HttpStatus.NotFound, MSG_BUSINESS.ITEM_NOT_FOUND);
    }

    // 2. Check change status
    if (currentItem.status === status) {
      throw new HttpException(HttpStatus.BadRequest, MSG_BUSINESS.STATUS_NO_CHANGE);
    }
     if (status !== undefined) {
      const isValidStatus = Object.values(ShiftAssignmentStatus)
          .includes(status as ShiftAssignmentStatus);

      if (!isValidStatus) {
          throw new HttpException(
            HttpStatus.BadRequest,
            "Invalid status value"
          );
      } 
    }
    // 3. Update status
    await this.repo.update(id, { status });

    // 4. Audit log
    await this.auditLogger.log({
      entityType: AuditEntityType.SHIFT_ASSIGNMENT,
      entityId: id,
      action: AuditAction.CHANGE_STATUS,
      oldData: { status: currentItem.status },
      newData: { status },
      changedBy: loggedUserId,
    });
  }
}
