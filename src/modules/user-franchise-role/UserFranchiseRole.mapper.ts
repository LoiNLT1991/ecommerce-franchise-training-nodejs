import { mapBaseResponse } from "../../core/mappers";
import { UserFranchiseRoleResponseDto } from "./dto/item.dto";
import { IUserFranchiseRole } from "./UserFranchiseRole.interface";

export const mapItemToResponse = (item: IUserFranchiseRole): UserFranchiseRoleResponseDto => {
  const { is_active, ...base } = mapBaseResponse(item);
  return {
    ...base,
    franchise_id: item.franchise_id,
    franchise_code: item.franchise_code,
    franchise_name: item.franchise_name,
    role_id: item.role_id,
    role_code: item.role_code,
    role_name: item.role_name,
    user_id: item.user_id,
    user_name: item.user_name,
    user_email: item.user_email,
    note: item.note || "",
  };
};
