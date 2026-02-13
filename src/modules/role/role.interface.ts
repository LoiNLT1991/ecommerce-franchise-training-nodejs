import { Document } from "mongoose";
import { BaseFieldName, RoleScope } from "../../core/enums";
import { IBase } from "../../core/interfaces";

export interface IRole extends Document, IBase {
  [BaseFieldName.CODE]: string;
  [BaseFieldName.NAME]: string;
  [BaseFieldName.DESCRIPTION]?: string;
  [BaseFieldName.SCOPE]: RoleScope;
}

export interface RoleQueryResult {
  id: string;
  code: string;
  scope: RoleScope;
}

export interface IRoleQuery {
  getRoleById(id: string): Promise<RoleQueryResult | null>;
  getByIds(ids: string[]): Promise<RoleQueryResult[]>;
}
