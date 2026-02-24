import { ClientSession, Document } from "mongoose";
import { BaseFieldName, BaseRole } from "../../core/enums";
import { IBase } from "../../core/interfaces";
import { UserFieldName } from "./user.enum";

export type UserRole = BaseRole.SUPER_ADMIN | BaseRole.MANAGER | BaseRole.STAFF | BaseRole.SHIPPER | BaseRole.USER;
export interface IUser extends Document, IBase {
  [BaseFieldName.EMAIL]: string;
  [BaseFieldName.PASSWORD]?: string;
  [BaseFieldName.NAME]: string;
  [BaseFieldName.PHONE]: string;
  [BaseFieldName.AVATAR_URL]: string;

  // check verify
  [UserFieldName.IS_VERIFIED]?: boolean; // default false,
  [UserFieldName.VERIFICATION_TOKEN]?: string | null; // default empty
  [UserFieldName.VERIFICATION_TOKEN_EXPIRES]?: Date | null; // default new Date()

  // check login/logout
  [UserFieldName.TOKEN_VERSION]: number; // default 0

  // check reset password time
  [UserFieldName.LAST_RESET_PASSWORD_AT]?: Date;
}

export interface IUserValidation {
  validEmailUnique(email: string, currentUserId?: string): Promise<void>;
  validUserToken(token: string): Promise<void>;
  validUserLogin(user: IUser, password: string): Promise<void>;
}

export interface IUserQuery {
  createUser(model: Partial<IUser>, session?: ClientSession): Promise<IUser>;
  updateUser(userId: string, updateData: Partial<IUser>, session?: ClientSession): Promise<IUser | null>;
  getUserByToken(token: string): Promise<IUser | null>;
  getUserByEmail(email: string): Promise<IUser | null>;
  getUserById(id: string, isFull?: boolean): Promise<IUser | null>;
  increaseTokenVersion(userId: string): Promise<IUser | null>;
}
