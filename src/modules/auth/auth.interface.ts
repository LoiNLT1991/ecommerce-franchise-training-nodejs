import ChangePasswordDto from "./dto/changePassword.dto";

export interface TokenData {
  token: string;
}

export interface BaseTokens {
  id: string;
  version: number;
}