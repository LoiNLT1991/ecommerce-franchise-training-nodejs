import { mapBaseResponse } from "../../core";
import { ICustomer } from "./customer.interface";
import { CustomerItemDto } from "./dto/item.dto";

export const mapItemToResponse = (item: ICustomer): CustomerItemDto => {
  const { ...base } = mapBaseResponse(item);

  return {
    ...base,
    email: item.email,
    name: item.name,
    phone: item.phone,
    avatar_url: item.avatar_url,
    address: item.address,
    is_verified: item.is_verified ?? false,
  };
};
