import { IUserContext } from "../../../core/models";

export interface AuthResponseDto {
  user: {
    id: string;
    email: string;
    name: string;
    phone: string;
    avatar_url: string;
  };
  roles: IUserContext[];
  active_context: IUserContext;
}
