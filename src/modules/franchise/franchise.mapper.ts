import { mapBaseResponse } from "../../core/mappers";
import { BaseItemSelectDto } from "../../core/models";
import { FranchiseItemDto } from "./dto/item.dto";
import { IFranchise } from "./franchise.interface";

export const mapItemToResponse = (item: IFranchise): FranchiseItemDto => {
  const base = mapBaseResponse(item);
  return {
    ...base,
    code: item.code,
    name: item.name,
    hotline: item.hotline,
    logo_url: item.logo_url,
    address: item.address,
    opened_at: item.opened_at,
    closed_at: item.closed_at,
  };
};

export const mapItemToSelect = (item: IFranchise): BaseItemSelectDto => {
  return {
    value: String(item._id),
    code: item.code,
    name: item.name,
  };
};
