import mongoose, { HydratedDocument, Schema, Types } from "mongoose";
import { BaseModelNoActive } from "../../core";
import { COLLECTION_NAME } from "../../core/constants";
import { IShiftAssignment } from "./shift-assignment.interface";
import { BaseFieldName, ShiftAssignmentStatus } from "../../core/enums/base.enum";

const ShiftAssignmentSchemaEntity = new Schema({
    [BaseFieldName.SHIFT_ID]: { type: Types.ObjectId, ref: COLLECTION_NAME.SHIFT, required: true },
    [BaseFieldName.USER_ID]: { type: Types.ObjectId, ref: COLLECTION_NAME.USER, required: true },
    [BaseFieldName.WORK_DATE]: { type: String, required: true },
    [BaseFieldName.ASSIGNED_BY]: { type: Types.ObjectId, ref: COLLECTION_NAME.USER, required: true },
    [BaseFieldName.STATUS]: { 
        type: String, 
        enum: Object.values(ShiftAssignmentStatus), 
        default: ShiftAssignmentStatus.ASSIGNED,
        required: true   
    },
    ...BaseModelNoActive,
});

export type ShiftAssignmentDocument = HydratedDocument<IShiftAssignment>;
const ShiftAssignmentSchema = mongoose.model<ShiftAssignmentDocument>(COLLECTION_NAME.SHIFT_ASSIGNMENT, ShiftAssignmentSchemaEntity);
export default ShiftAssignmentSchema;
