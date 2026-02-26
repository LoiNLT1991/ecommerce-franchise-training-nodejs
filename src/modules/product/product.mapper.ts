import { mapBaseResponse } from "../../core/mappers";
import { ProductItemDto } from "./dto/item.dto";
import { IProduct } from "./product.interface";

export const mapItemToResponse = (item: IProduct): ProductItemDto => {
  const base = mapBaseResponse(item);
  return {
    ...base,
    SKU: item.SKU,
    name: item.name,
    description: item.description,
    image_url: item.image_url,
    images_url: item.images_url,
    content: item.content,
    min_price: item.min_price,
    max_price: item.max_price,
    is_have_topping: item.is_have_topping,
  };
};
