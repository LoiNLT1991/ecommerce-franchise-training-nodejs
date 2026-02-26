import { Request } from "express";
import { BaseFieldName, RoleScope } from "../enums";

export const BaseModelFields = {
  [BaseFieldName.IS_ACTIVE]: { type: Boolean, default: true },
  [BaseFieldName.CREATED_AT]: { type: Date, default: Date.now },
  [BaseFieldName.UPDATED_AT]: { type: Date, default: Date.now },
  [BaseFieldName.IS_DELETED]: { type: Boolean, default: false },
};

export interface AuthenticatedUserRequest extends Request {
  user: {
    id: string;
    context: IUserContext | null;
    version: number;
    type: "user";
  };
}

export interface AuthenticatedCustomerRequest extends Request {
  user: {
    id: string;
    context: null; // Customers don't have a context
    version: number;
    type: "customer";
  };
}

export interface UserAuthPayload {
  id: string;
  context: IUserContext | null;
  version: number;
  type: "user" | "customer";
}

export interface CustomerAuthPayload {
  id: string;
  context: null; // Customers don't have a context
  version: number;
  type: "customer";
}

export interface IUserContext {
  role: string; // role.code
  scope: RoleScope; // GLOBAL | FRANCHISE
  franchise_id: string | null; // null if GLOBAL
}

export interface BaseItemSelectDto {
  value: string;
  code: string;
  name: string;
}
