import { mapBaseResponse } from "../../core";
import { IUser, UserItemDto } from "../user";

export const mapItemToResponse = (item: IUser): UserItemDto => {
  const { ...base } = mapBaseResponse(item);

  return {
    ...base,
    email: item.email,
    name: item.name,
    phone: item.phone,
    avatar_url: item.avatar_url,
    is_verified: item.is_verified ?? false,
  };
};
