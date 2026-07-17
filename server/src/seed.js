import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import addressModel from "./models/address.model.js";
import categoryModel from "./models/category.model.js";
import productModel from "./models/product.model.js";
import subCategoryModel from "./models/subCategory.model.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const seedData = async () => {
  try {
    const productCount = await productModel.countDocuments();
    if (productCount > 0) {
      console.log("Dữ liệu đã tồn tại, bỏ qua seed.");
      return;
    }

    console.log("Bắt đầu seed dữ liệu...");

    const categoriesPath = resolve(__dirname, "seedCategories.json");
    if (!existsSync(categoriesPath)) {
      console.error("Không tìm thấy file seedCategories.json");
      return;
    }
    const categories = JSON.parse(readFileSync(categoriesPath, "utf8"));

    const categoryMap = {};
    for (const cat of categories) {
      const created = await categoryModel.create({
        image: cat.image,
        name: cat.name,
      });
      categoryMap[cat.name] = created._id;
    }
    console.log(`Đã seed ${categories.length} danh mục.`);

    const productsPath = resolve(__dirname, "seedProducts.json");
    if (!existsSync(productsPath)) {
      console.error("Không tìm thấy file seedProducts.json");
      return;
    }
    const products = JSON.parse(readFileSync(productsPath, "utf8"));

    const subCategorySet = new Map();
    for (const prod of products) {
      if (prod.subCategory && !subCategorySet.has(prod.subCategory)) {
        const catId = categoryMap[prod.category];
        const created = await subCategoryModel.create({
          category: catId ? [catId] : [],
          image:
            Array.isArray(prod.image) && prod.image.length > 0
              ? prod.image[0]
              : "",
          name: prod.subCategory,
        });
        subCategorySet.set(prod.subCategory, created._id);
      }
    }
    console.log(`Đã seed ${subCategorySet.size} danh mục con.`);

    for (const prod of products) {
      const catId = categoryMap[prod.category] || null;
      const subCatId = subCategorySet.get(prod.subCategory) || null;

      await productModel.create({
        category: catId ? [catId] : [],
        description: prod.description || "",
        discount: prod.discount ?? null,
        image: Array.isArray(prod.image) ? prod.image : [],
        name: prod.name,
        price: prod.price ?? null,
        publish: true,
        stock: prod.stock ?? 0,
        subCategory: subCatId ? [subCatId] : [],
        unit: prod.unit || "",
      });
    }
    console.log(`Đã seed ${products.length} sản phẩm.`);

    const addressPath = resolve(__dirname, "seedAddress.json");
    if (existsSync(addressPath)) {
      const addresses = JSON.parse(readFileSync(addressPath, "utf8"));
      if (Array.isArray(addresses) && addresses.length > 0) {
        const addrCount = await addressModel.countDocuments();
        if (addrCount === 0) {
          for (const addr of addresses) {
            await addressModel.create({
              address_line: addr.address_line || "",
              city: addr.city || "",
              mobile: addr.mobile || "",
              pincode: addr.pincode || "",
              state: addr.state || "",
              status: addr.status ?? true,
            });
          }
          console.log(`Đã seed ${addresses.length} địa chỉ mẫu.`);
        }
      }
    }

    console.log("Seed dữ liệu hoàn tất!");
  } catch (error) {
    console.error("Lỗi khi seed dữ liệu:", error);
  }
};

export default seedData;
