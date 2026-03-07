import { ICustomer } from "../customer";
import { CustomerProfileDto } from "./dto/profile.dto";

export const mapItemToResponse = (item: ICustomer): CustomerProfileDto => {
  return {
    id: item._id.toString(),
    email: item.email,
    name: item.name,
    phone: item.phone,
    avatar_url: item.avatar_url,
    address: item.address,
  };
};
