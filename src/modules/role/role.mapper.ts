import { RoleSelectDto } from "./dto/role.dto";
import { IRole } from "./role.interface";

export const mapRoleToResponse = (item: IRole): RoleSelectDto => {
  return {
    value: String(item._id),
    code: item.code,
    name: item.name,
    scope: item.scope,
  };
};
