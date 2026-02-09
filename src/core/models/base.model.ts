import { Request } from "express";
import { RoleScope } from "../enums";

export const BaseModelFields = {
  is_active: { type: Boolean, default: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  is_deleted: { type: Boolean, default: false },
};

export interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    context: IUserContext | null;
    version: number;
  };
}

export interface AuthUser {
  id: string;
  context: IUserContext | null;
  version: number;
}

export interface IUserContext {
  role: string; // role.code
  scope: RoleScope; // GLOBAL | FRANCHISE
  franchise_id: string | null; // null if GLOBAL
}
