export interface ProductItemDto {
  id: string;
  SKU: string;
  name: string;
  description: string;
  image_url: string;
  images_url?: string[];
  content: string;
  min_price: number;
  max_price: number;
  is_have_topping: boolean;
  is_active: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}
