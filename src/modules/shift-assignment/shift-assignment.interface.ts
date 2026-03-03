import { Document, Types } from "mongoose";
import { IBase } from "../../core";
import { BaseFieldName, ShiftAssignmentStatus } from "../../core/enums/base.enum";
import { SearchPaginationItemDto } from "./dto/search.dto";

export interface IShiftAssignment extends Document, IBase {
    [BaseFieldName.SHIFT_ID]: Types.ObjectId;
    [BaseFieldName.USER_ID]: Types.ObjectId;
    [BaseFieldName.WORK_DATE]: string;
    [BaseFieldName.ASSIGNED_BY]: Types.ObjectId;
    [BaseFieldName.STATUS]: ShiftAssignmentStatus;
    [BaseFieldName.IS_DELETED]: boolean;
}


export interface IShiftAssignmentQuery {
    getById(id: string): Promise<IShiftAssignment | null>;
    
}