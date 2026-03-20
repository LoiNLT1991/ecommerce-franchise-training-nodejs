import { Types } from "mongoose";
import { BaseItemDto } from "../../../core";

export interface ShiftItemDto extends BaseItemDto {
  franchise_id: Types.ObjectId;
  franchise_name?: string;
  name: string;
  start_time: string;
  end_time: string;
}
