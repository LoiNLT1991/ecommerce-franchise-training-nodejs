import { Document, Types } from "mongoose";
import { RoleScope } from "../../core/enums";
import { IBase } from "../../core/interfaces";
import { RoleFieldName } from "./role.enum";

export interface IRole extends Document, IBase {
  [RoleFieldName.CODE]: string;
  [RoleFieldName.NAME]: string;
  [RoleFieldName.SCOPE]: RoleScope;
  [RoleFieldName.DESCRIPTION]?: string;
}

export interface RoleQueryResult {
  id: Types.ObjectId | string;
  code: string;
  scope: RoleScope;
}

export interface IRoleQuery {
  getRoleById(id: string): Promise<RoleQueryResult | null>;
  getByIds(ids: string[]): Promise<RoleQueryResult[]>;
}
