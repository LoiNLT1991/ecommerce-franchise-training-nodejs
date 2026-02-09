import { IUserContext } from "../../core/models";
import { IUser } from "../user";
import { AuthResponseDto } from "./dto/authResponse.dto";

export const mapAuthToResponse = (
  user: IUser,
  roles: IUserContext[],
  activeContext: IUserContext | null,
): AuthResponseDto => {
  return {
    user: {
      id: user._id.toString(),
      email: user.email,
      phone: user.phone,
      name: user.name,
      avatar_url: user.avatar_url,
    },
    roles,
    active_context: activeContext as IUserContext,
  };
};
