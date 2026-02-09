import { Document, Types } from "mongoose";
import { BaseFieldName, RoleScope } from "../../core/enums";
import { IBase } from "../../core/interfaces";
import { RoleFieldName } from "./role.enum";

export interface IRole extends Document, IBase {
  [BaseFieldName.CODE]: string;
  [BaseFieldName.NAME]: string;
  [BaseFieldName.DESCRIPTION]?: string;
  [RoleFieldName.SCOPE]: RoleScope;
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
