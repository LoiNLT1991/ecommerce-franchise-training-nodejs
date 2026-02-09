import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  Validate,
  ValidationArguments,
} from "class-validator";

export class PriceRangeValidator {
  validate(_: any, args: ValidationArguments) {
    const obj = args.object as any;
    return obj.max_price >= obj.min_price;
  }

  defaultMessage() {
    return "max_price must be greater than or equal to min_price";
  }
}

export default class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  SKU: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  image_url: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNumber()
  @Min(0)
  min_price: number;

  @IsNumber()
  @Min(0)
  @Validate(PriceRangeValidator)
  max_price: number;

  @IsOptional()
  @IsArray()
  images_url?: string[];

  constructor(
    SKU: string,
    name: string,
    description: string,
    image_url: string,
    content: string,
    min_price: number,
    max_price: number,
    images_url?: string[],
  ) {
    this.SKU = SKU;
    this.name = name;
    this.description = description;
    this.image_url = image_url;
    this.content = content;
    this.min_price = min_price;
    this.max_price = max_price;
    this.images_url = images_url;
  }
}
