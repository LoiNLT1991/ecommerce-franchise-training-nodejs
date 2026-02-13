import ProductSchema from "../../modules/product/product.model";
import { PRODUCT_CODE, SEED } from "../constants";
import { runMigration } from "../runner";

const DESCRIPTION =
  "Sản phẩm cà phê rang xay chất lượng cao, mang đến hương vị đậm đà và thơm ngon, phù hợp cho mọi cách pha chế.";
const CONTENT =
  "<h3><span><strong><b>I. Giới thiệu sản phẩm</b></strong></span></h3><p><span>Cà phê được chọn lọc từ những hạt cà phê chất lượng cao, rang xay theo quy trình tiêu chuẩn nhằm giữ trọn hương vị tự nhiên.</span></p><p><strong><b><span>1.1 Nguồn gốc</span></b></strong></p><p><span>Hạt cà phê được thu hoạch từ các vùng cao nguyên nổi tiếng, nơi có điều kiện khí hậu và thổ nhưỡng lý tưởng cho cây cà phê phát triển.</span></p><p><strong><b><span>1.2 Hương vị đặc trưng</span></b></strong></p><ul><li><span>Hương thơm đậm đà, dễ chịu</span></li><li><span>Vị cân bằng giữa đắng nhẹ và hậu ngọt</span></li><li><span>Phù hợp với nhiều cách pha chế</span></li></ul><h3><span><strong><b>II. Cách thưởng thức</b></strong></span></h3><p><span>Sản phẩm phù hợp để pha phin truyền thống, pha máy espresso hoặc kết hợp cùng sữa tươi, sữa đặc.</span></p><p><strong><b><span>Gợi ý:</span></b></strong></p><p><span>Nên dùng nóng vào buổi sáng để cảm nhận trọn vẹn hương vị và giúp tinh thần tỉnh táo.</span></p><h3><span><strong><b>III. Bảo quản</b></strong></span></h3><p><span>Bảo quản sản phẩm ở nơi khô ráo, thoáng mát, tránh ánh nắng trực tiếp và đậy kín sau khi mở bao bì.</span></p><p><em><i><span>Sản phẩm phù hợp sử dụng hằng ngày cho gia đình, văn phòng và quán cà phê.</span></i></em></p>";
const IMAGE_URL = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTaSd_r5Mg-jKKT1I-IBbOWxnbA9JGRP3URQQ&s";
const IMAGES_URL = [
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTaSd_r5Mg-jKKT1I-IBbOWxnbA9JGRP3URQQ&s",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Roasted_coffee_beans.jpg/960px-Roasted_coffee_beans.jpg",
];

const DEFAULT_PRODUCTS = [
  {
    SKU: PRODUCT_CODE.ESP001,
    name: "Espresso",
    description: DESCRIPTION,
    content: CONTENT,
    image_url: IMAGE_URL,
    images_url: IMAGES_URL,
    min_price: 30000,
    max_price: 45000,
  },
  {
    SKU: PRODUCT_CODE.ESP002,
    name: "Americano",
    description: DESCRIPTION,
    content: CONTENT,
    image_url: IMAGE_URL,
    images_url: IMAGES_URL,
    min_price: 35000,
    max_price: 50000,
  },
  {
    SKU: PRODUCT_CODE.ESP003,
    name: "Latte",
    description: DESCRIPTION,
    content: CONTENT,
    image_url: IMAGE_URL,
    images_url: IMAGES_URL,
    min_price: 40000,
    max_price: 55000,
  },
  {
    SKU: PRODUCT_CODE.ESP004,
    name: "Cappuccino",
    description: DESCRIPTION,
    content: CONTENT,
    image_url: IMAGE_URL,
    images_url: IMAGES_URL,
    min_price: 42000,
    max_price: 58000,
  },
  {
    SKU: PRODUCT_CODE.VCOF001,
    name: "Cà phê đen đá",
    description: DESCRIPTION,
    content: CONTENT,
    image_url: IMAGE_URL,
    images_url: IMAGES_URL,
    min_price: 25000,
    max_price: 35000,
  },
  {
    SKU: PRODUCT_CODE.VCOF002,
    name: "Cà phê sữa đá",
    description: DESCRIPTION,
    content: CONTENT,
    image_url: IMAGE_URL,
    images_url: IMAGES_URL,
    min_price: 28000,
    max_price: 38000,
  },
  {
    SKU: PRODUCT_CODE.TEA001,
    name: "Trà đào cam sả",
    description: DESCRIPTION,
    content: CONTENT,
    image_url: IMAGE_URL,
    images_url: IMAGES_URL,
    min_price: 35000,
    max_price: 48000,
  },
  {
    SKU: PRODUCT_CODE.TEA002,
    name: "Trà vải hoa hồng",
    description: DESCRIPTION,
    content: CONTENT,
    image_url: IMAGE_URL,
    images_url: IMAGES_URL,
    min_price: 36000,
    max_price: 50000,
  },
  {
    SKU: PRODUCT_CODE.ICE001,
    name: "Caramel Ice Blended",
    description: DESCRIPTION,
    content: CONTENT,
    image_url: IMAGE_URL,
    images_url: IMAGES_URL,
    min_price: 45000,
    max_price: 60000,
  },
  {
    SKU: PRODUCT_CODE.SMT001,
    name: "Sinh tố xoài",
    description: DESCRIPTION,
    content: CONTENT,
    image_url: IMAGE_URL,
    images_url: IMAGES_URL,
    min_price: 40000,
    max_price: 55000,
  },
  {
    SKU: PRODUCT_CODE.TTHK001,
    name: "Trân châu hoàng kim",
    description: DESCRIPTION,
    content: CONTENT,
    image_url: IMAGE_URL,
    images_url: IMAGES_URL,
    min_price: 10000,
    max_price: 15000,
  },
  {
    SKU: PRODUCT_CODE.TTD001,
    name: "Trân châu đen",
    description: DESCRIPTION,
    content: CONTENT,
    image_url: IMAGE_URL,
    images_url: IMAGES_URL,
    min_price: 10000,
    max_price: 15000,
  },
  {
    SKU: PRODUCT_CODE.PLAN001,
    name: "Bánh plan trứng",
    description: DESCRIPTION,
    content: CONTENT,
    image_url: IMAGE_URL,
    images_url: IMAGES_URL,
    min_price: 15000,
    max_price: 20000,
  },
];

export async function seedProductMigration() {
  await runMigration(SEED.SEED_007_PRODUCT, async () => {
    for (const item of DEFAULT_PRODUCTS) {
      // 🔹 1. Check product tồn tại theo SKU
      const existed = await ProductSchema.findOne({
        SKU: item.SKU,
      });

      if (existed) {
        console.log(`⏩ Product ${item.SKU} already exists`);
        continue;
      }

      // 🔹 2. Create product
      await ProductSchema.create({
        SKU: item.SKU,
        name: item.name,
        description: item.description,
        content: item.content,
        image_url: item.image_url,
        images_url: item.images_url,
        min_price: item.min_price,
        max_price: item.max_price,
        is_active: true,
        is_deleted: false,
      });

      console.log(`✅ Created product ${item.SKU}`);
    }
  });
}
