import { mapBaseResponse } from "../../core/mappers";
import { UserFranchiseRoleResponseDto } from "./dto/item.dto";
import { IUserFranchiseRole } from "./user-franchise-role.interface";

export const mapItemToResponse = (item: IUserFranchiseRole): UserFranchiseRoleResponseDto => {
  const { ...base } = mapBaseResponse(item);
  return {
    ...base,
    franchise_id: String(item.franchise_id),
    franchise_code: item.franchise_code,
    franchise_name: item.franchise_name,
    role_id: String(item.role_id),
    role_code: item.role_code,
    role_name: item.role_name,
    user_id: String(item.user_id),
    user_name: item.user_name,
    user_email: item.user_email,
    note: item.note || "",
  };
};
