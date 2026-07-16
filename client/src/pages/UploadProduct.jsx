import { ImagePlus, Trash2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { IoClose } from "react-icons/io5";
import { useSelector } from "react-redux";
import AddFieldComponent from "../components/AddFieldComponent";
import Loading from "../components/Loading";
import ViewImage from "../components/ViewImage";
import uploadImage from "../utils/uploadImage";

const ALLOWED_TYPES = ["image/gif", "image/jpeg", "image/png", "image/webp"];

const UploadProduct = () => {
  const allCategory = useSelector((state) => state.product.allCategory);
  const allSubCategory = useSelector((state) => state.product.allSubCategory);

  const [data, setData] = useState({
    category: [],
    description: "",
    discount: "",
    image: [],
    moreDetails: {},
    name: "",
    price: "",
    stock: "",
    subCategory: [],
    unit: "",
  });
  const [imageLoading, setImageLoading] = useState(false);
  const [viewImageURL, setViewImageURL] = useState("");
  const [openAddField, setOpenAddField] = useState(false);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectCategory = (e) => {
    const value = e.target.value;
    e.target.value = "";

    const category = allCategory.find((item) => item._id === value);
    if (!category) return;

    const exists = data.category.some((id) => id === value);
    if (exists) return;

    setData((prev) => ({
      ...prev,
      category: [...prev.category, value],
    }));
  };

  const handleSelectSubCategory = (e) => {
    const value = e.target.value;
    e.target.value = "";

    const subCategory = allSubCategory.find((item) => item._id === value);
    if (!subCategory) return;

    const exists = data.subCategory.some((id) => id === value);
    if (exists) return;

    setData((prev) => ({
      ...prev,
      subCategory: [...prev.subCategory, value],
    }));
  };

  const handleRemoveCategory = (id) => {
    setData((prev) => ({
      ...prev,
      category: prev.category.filter((item) => item !== id),
    }));
  };

  const handleRemoveSubCategory = (id) => {
    setData((prev) => ({
      ...prev,
      subCategory: prev.subCategory.filter((item) => item !== id),
    }));
  };

  const handleAddField = (fieldName) => {
    if (!fieldName.trim()) return;

    setData((prev) => ({
      ...prev,
      moreDetails: {
        ...prev.moreDetails,
        [fieldName]: prev.moreDetails[fieldName] ?? "",
      },
    }));
    setOpenAddField(false);
  };

  const handleChangeMoreDetails = (key, value) => {
    setData((prev) => ({
      ...prev,
      moreDetails: {
        ...prev.moreDetails,
        [key]: value,
      },
    }));
  };

  const handleRemoveField = (key) => {
    const copy = { ...data.moreDetails };
    delete copy[key];
    setData((prev) => ({
      ...prev,
      moreDetails: copy,
    }));
  };

  const handleUploadImage = async (e) => {
    const files = Array.from(e.target.files ?? []);

    if (files.length === 0) return;

    const invalid = files.find((file) => !ALLOWED_TYPES.includes(file.type));
    if (invalid) {
      toast.error("Chỉ chấp nhận ảnh JPG, PNG, WEBP hoặc GIF");
      e.target.value = "";
      return;
    }

    setImageLoading(true);

    for (const file of files) {
      try {
        const uploadRes = await uploadImage(file, "product");
        const imageUrl =
          uploadRes?.data?.url ??
          uploadRes?.data?.image ??
          uploadRes?.url ??
          "";

        if (!imageUrl) {
          toast.error("Tải ảnh lên thất bại");
          continue;
        }

        setData((prev) => ({
          ...prev,
          image: [...prev.image, imageUrl],
        }));
      } catch {
        toast.error("Tải ảnh lên thất bại");
      }
    }

    setImageLoading(false);
    e.target.value = "";
  };

  const handleDeleteImage = (index) => {
    const newImages = [...data.image];
    newImages.splice(index, 1);
    setData((prev) => ({
      ...prev,
      image: newImages,
    }));
  };

  return (
    <section className="rounded-xl bg-white p-4 shadow-md">
      <div className="border-gray-200 border-b pb-3">
        <h2 className="font-semibold text-lg text-secondary-100 lg:text-xl">
          Thêm sản phẩm
        </h2>
      </div>

      <div className="min-h-[78vh] space-y-4 pt-4">
        <div className="grid gap-1.5">
          <label
            className="font-medium text-secondary-100 text-sm"
            htmlFor="productName"
          >
            Tên sản phẩm
          </label>
          <input
            className="h-11 rounded-lg border border-gray-300 bg-blue-50/40 px-3 text-secondary-100 outline-none transition-colors focus-visible:border-primary-200 focus-visible:ring-2 focus-visible:ring-primary-200"
            id="productName"
            name="name"
            onChange={handleOnChange}
            placeholder="Nhập tên sản phẩm"
            type="text"
            value={data.name}
          />
        </div>

        <div className="grid gap-1.5">
          <label
            className="font-medium text-secondary-100 text-sm"
            htmlFor="productDescription"
          >
            Mô tả
          </label>
          <textarea
            className="min-h-24 rounded-lg border border-gray-300 bg-blue-50/40 px-3 py-2 text-secondary-100 outline-none transition-colors focus-visible:border-primary-200 focus-visible:ring-2 focus-visible:ring-primary-200"
            id="productDescription"
            name="description"
            onChange={handleOnChange}
            placeholder="Nhập mô tả sản phẩm"
            value={data.description}
          />
        </div>

        <div className="grid gap-1.5">
          <span className="font-medium text-secondary-100 text-sm">
            Hình ảnh
          </span>

          <label
            className="flex h-32 w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-gray-300 border-dashed bg-gray-50/50 transition-colors hover:border-primary-200 hover:bg-primary-50"
            htmlFor="productImage"
          >
            <ImagePlus aria-hidden="true" className="text-gray-400" size={32} />
            <span className="font-medium text-secondary-100 text-sm">
              Tải ảnh lên
            </span>
            <span className="text-gray-400 text-xs">
              JPG, PNG, WEBP hoặc GIF
            </span>
            <input
              accept="image/*"
              className="hidden"
              id="productImage"
              multiple
              onChange={handleUploadImage}
              type="file"
            />
          </label>

          {imageLoading && <Loading label="Đang tải ảnh..." />}

          {data.image.length > 0 && (
            <div className="flex flex-wrap gap-4">
              {data.image.map((image, index) => (
                <div
                  className="group relative rounded-lg border border-gray-200"
                  key={image}
                >
                  <button
                    className="block cursor-pointer rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-primary-200"
                    onClick={() => setViewImageURL(image)}
                    type="button"
                  >
                    <img
                      alt={`Ảnh sản phẩm ${index + 1}`}
                      className="h-24 w-24 rounded-lg object-scale-down"
                      src={image}
                    />
                  </button>
                  <button
                    aria-label={`Xóa ảnh ${index + 1}`}
                    className="absolute top-2 right-2 hidden items-center justify-center rounded-lg bg-red-600 p-1.5 text-white transition-colors hover:bg-red-700 focus-visible:flex focus-visible:ring-2 focus-visible:ring-red-600 group-hover:flex"
                    onClick={() => handleDeleteImage(index)}
                    type="button"
                  >
                    <Trash2 aria-hidden="true" size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="grid gap-1.5">
          <label
            className="font-medium text-secondary-100 text-sm"
            htmlFor="productCategory"
          >
            Danh mục
          </label>

          <select
            className="h-11 w-full rounded-lg border border-gray-300 bg-blue-50/40 px-3 text-secondary-100 outline-none transition-colors focus-visible:border-primary-200 focus-visible:ring-2 focus-visible:ring-primary-200"
            id="productCategory"
            onChange={handleSelectCategory}
            value=""
          >
            <option value="">Chọn danh mục</option>
            {allCategory.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>

          {data.category.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {data.category.map((id) => {
                const category = allCategory.find((item) => item._id === id);
                if (!category) return null;
                return (
                  <p
                    className="flex items-center gap-1.5 rounded-full bg-primary-100 px-3 py-1 font-medium text-secondary-100 text-sm"
                    key={id}
                  >
                    {category.name}
                    <button
                      aria-label={`Bỏ chọn ${category.name}`}
                      className="rounded-full outline-none transition-colors hover:text-red-600 focus-visible:ring-2 focus-visible:ring-red-600"
                      onClick={() => handleRemoveCategory(id)}
                      type="button"
                    >
                      <IoClose aria-hidden="true" size={14} />
                    </button>
                  </p>
                );
              })}
            </div>
          )}
        </div>

        <div className="grid gap-1.5">
          <label
            className="font-medium text-secondary-100 text-sm"
            htmlFor="productSubCategory"
          >
            Danh mục con
          </label>

          <select
            className="h-11 w-full rounded-lg border border-gray-300 bg-blue-50/40 px-3 text-secondary-100 outline-none transition-colors focus-visible:border-primary-200 focus-visible:ring-2 focus-visible:ring-primary-200"
            id="productSubCategory"
            onChange={handleSelectSubCategory}
            value=""
          >
            <option value="">Chọn danh mục con</option>
            {allSubCategory.map((subCategory) => (
              <option key={subCategory._id} value={subCategory._id}>
                {subCategory.name}
              </option>
            ))}
          </select>

          {data.subCategory.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {data.subCategory.map((id) => {
                const subCategory = allSubCategory.find(
                  (item) => item._id === id,
                );
                if (!subCategory) return null;
                return (
                  <p
                    className="flex items-center gap-1.5 rounded-full bg-primary-100 px-3 py-1 font-medium text-secondary-100 text-sm"
                    key={id}
                  >
                    {subCategory.name}
                    <button
                      aria-label={`Bỏ chọn ${subCategory.name}`}
                      className="rounded-full outline-none transition-colors hover:text-red-600 focus-visible:ring-2 focus-visible:ring-red-600"
                      onClick={() => handleRemoveSubCategory(id)}
                      type="button"
                    >
                      <IoClose aria-hidden="true" size={14} />
                    </button>
                  </p>
                );
              })}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-1.5">
            <label
              className="font-medium text-secondary-100 text-sm"
              htmlFor="productUnit"
            >
              Đơn vị
            </label>
            <input
              className="h-11 rounded-lg border border-gray-300 bg-blue-50/40 px-3 text-secondary-100 outline-none transition-colors focus-visible:border-primary-200 focus-visible:ring-2 focus-visible:ring-primary-200"
              id="productUnit"
              name="unit"
              onChange={handleOnChange}
              placeholder="Ví dụ: kg, hộp, chai"
              type="text"
              value={data.unit}
            />
          </div>

          <div className="grid gap-1.5">
            <label
              className="font-medium text-secondary-100 text-sm"
              htmlFor="productStock"
            >
              Tồn kho
            </label>
            <input
              className="h-11 rounded-lg border border-gray-300 bg-blue-50/40 px-3 text-secondary-100 outline-none transition-colors focus-visible:border-primary-200 focus-visible:ring-2 focus-visible:ring-primary-200"
              id="productStock"
              name="stock"
              onChange={handleOnChange}
              placeholder="Số lượng"
              type="number"
              value={data.stock}
            />
          </div>

          <div className="grid gap-1.5">
            <label
              className="font-medium text-secondary-100 text-sm"
              htmlFor="productPrice"
            >
              Giá
            </label>
            <input
              className="h-11 rounded-lg border border-gray-300 bg-blue-50/40 px-3 text-secondary-100 outline-none transition-colors focus-visible:border-primary-200 focus-visible:ring-2 focus-visible:ring-primary-200"
              id="productPrice"
              name="price"
              onChange={handleOnChange}
              placeholder="Giá bán"
              type="number"
              value={data.price}
            />
          </div>

          <div className="grid gap-1.5">
            <label
              className="font-medium text-secondary-100 text-sm"
              htmlFor="productDiscount"
            >
              Giảm giá
            </label>
            <input
              className="h-11 rounded-lg border border-gray-300 bg-blue-50/40 px-3 text-secondary-100 outline-none transition-colors focus-visible:border-primary-200 focus-visible:ring-2 focus-visible:ring-primary-200"
              id="productDiscount"
              name="discount"
              onChange={handleOnChange}
              placeholder="Phần trăm giảm"
              type="number"
              value={data.discount}
            />
          </div>
        </div>

        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <span className="font-medium text-secondary-100 text-sm">
              Thông tin bổ sung
            </span>
            <button
              className="rounded border border-primary-200 px-3 py-1.5 font-medium text-secondary-100 text-sm outline-none transition-all hover:bg-primary-200 focus-visible:ring-2 focus-visible:ring-primary-200"
              onClick={() => setOpenAddField(true)}
              type="button"
            >
              Thêm trường
            </button>
          </div>

          {Object.keys(data.moreDetails).length > 0 && (
            <div className="grid gap-3">
              {Object.keys(data.moreDetails).map((key) => (
                <div className="grid gap-1.5" key={key}>
                  <div className="flex items-center justify-between">
                    <label
                      className="font-medium text-secondary-100 text-sm"
                      htmlFor={`field-${key}`}
                    >
                      {key}
                    </label>
                    <button
                      aria-label={`Xóa trường ${key}`}
                      className="rounded p-1 text-red-600 outline-none transition-colors hover:bg-red-50 focus-visible:ring-2 focus-visible:ring-red-600"
                      onClick={() => handleRemoveField(key)}
                      type="button"
                    >
                      <Trash2 aria-hidden="true" size={16} />
                    </button>
                  </div>
                  <input
                    className="h-11 rounded-lg border border-gray-300 bg-blue-50/40 px-3 text-secondary-100 outline-none transition-colors focus-visible:border-primary-200 focus-visible:ring-2 focus-visible:ring-primary-200"
                    id={`field-${key}`}
                    onChange={(e) =>
                      handleChangeMoreDetails(key, e.target.value)
                    }
                    placeholder={`Nhập ${key}`}
                    type="text"
                    value={data.moreDetails[key]}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {viewImageURL && (
        <ViewImage close={() => setViewImageURL("")} url={viewImageURL} />
      )}

      {openAddField && (
        <AddFieldComponent
          close={() => setOpenAddField(false)}
          onAdd={handleAddField}
        />
      )}
    </section>
  );
};

export default UploadProduct;
