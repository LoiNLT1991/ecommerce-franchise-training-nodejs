import { Document } from "mongoose";
import { IBase } from "../../core/interfaces";
import { UserFranchiseRoleFieldName } from "./user-franchise-role.enum";
import { IUserContext } from "../../core/models";

export interface IUserFranchiseRole extends Document, IBase {
  [UserFranchiseRoleFieldName.FRANCHISE_ID]: string;
  franchise_code: string;
  franchise_name: string;
  [UserFranchiseRoleFieldName.ROLE_ID]: string;
  role_code: string;
  role_name: string;
  [UserFranchiseRoleFieldName.USER_ID]: string;
  user_name: string;
  user_email: string;
  [UserFranchiseRoleFieldName.NOTE]?: string;
}

export interface IUserFranchiseRoleQuery {
  getUserContexts(userId: string): Promise<IUserContext[]>;
}
