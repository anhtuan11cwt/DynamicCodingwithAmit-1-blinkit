import {
  ImagePlus,
  Loader2,
  Pencil,
  Plus,
  Send,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { IoClose } from "react-icons/io5";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import SummaryApi from "../common/SummaryApi";
import AddFieldComponent from "../components/AddFieldComponent";
import ViewImage from "../components/ViewImage";
import Axios from "../utils/axios";
import successAlert from "../utils/successAlert";
import uploadImage from "../utils/uploadImage";
import { productSchema } from "../validations/product.validation";

const ALLOWED_TYPES = ["image/gif", "image/jpeg", "image/png", "image/webp"];
const MAX_IMAGES = 5;

const PRODUCT_UNITS = [
  "Kg",
  "Gram",
  "Lít",
  "ml",
  "Hộp",
  "Chai",
  "Gói",
  "Túi",
  "Lon",
  "Cái",
  "Bịch",
  "Chục",
];

const UploadProduct = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(productId);

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
  const [existingImages, setExistingImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [loadingProduct, setLoadingProduct] = useState(false);
  const [viewImageURL, setViewImageURL] = useState("");
  const [openAddField, setOpenAddField] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    return () => {
      imagePreviews.forEach((url) => {
        URL.revokeObjectURL(url);
      });
    };
  }, [imagePreviews]);

  useEffect(() => {
    if (!productId) return;

    const fetchProduct = async () => {
      setLoadingProduct(true);
      try {
        const response = await Axios({
          ...SummaryApi.getProductById,
          data: { _id: productId },
        });

        if (response.data.success) {
          const p = response.data.data;
          setData({
            category: p.category || [],
            description: p.description || "",
            discount: p.discount ?? "",
            image: p.image || [],
            moreDetails: p.more_details || {},
            name: p.name || "",
            price: p.price ?? "",
            stock: p.stock ?? "",
            subCategory: p.subCategory || [],
            unit: p.unit || "",
          });
          setExistingImages(p.image || []);
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || "Không thể tải sản phẩm");
      } finally {
        setLoadingProduct(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
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
    if (errors.category) {
      setErrors((prev) => ({ ...prev, category: undefined }));
    }
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
    if (errors.subCategory) {
      setErrors((prev) => ({ ...prev, subCategory: undefined }));
    }
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const totalImages = existingImages.length + imageFiles.length;

    const payload = {
      category: data.category,
      description: data.description,
      discount: data.discount ? Number(data.discount) : null,
      image:
        totalImages > 0
          ? [
              ...existingImages,
              ...imageFiles.map((_, i) => `https://placeholder.com/${i}`),
            ]
          : [],
      more_details: data.moreDetails,
      name: data.name,
      price: data.price !== "" ? Number(data.price) : undefined,
      stock: data.stock !== "" ? Number(data.stock) : 0,
      subCategory: data.subCategory,
      unit: data.unit,
    };

    const parsed = productSchema.safeParse(payload);

    if (!parsed.success) {
      const fieldErrors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0];
        if (key && !fieldErrors[key]) {
          fieldErrors[key] = issue.message;
        }
      }
      if (totalImages === 0) {
        fieldErrors.image = "Cần ít nhất một hình ảnh";
      }
      setErrors(fieldErrors);
      const firstKey = [
        "name",
        "description",
        "image",
        "category",
        "subCategory",
        "unit",
        "price",
        "stock",
        "discount",
      ].find((k) => fieldErrors[k]);
      if (firstKey) {
        const el = document.getElementById(
          firstKey === "image"
            ? "productImage"
            : firstKey === "category"
              ? "productCategory"
              : firstKey === "subCategory"
                ? "productSubCategory"
                : firstKey === "unit"
                  ? "productUnit"
                  : firstKey === "price"
                    ? "productPrice"
                    : firstKey === "stock"
                      ? "productStock"
                      : firstKey === "discount"
                        ? "productDiscount"
                        : `product-${firstKey}`,
        );
        el?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    setSubmitting(true);

    try {
      const uploadedUrls = [];

      for (let i = 0; i < imageFiles.length; i++) {
        const file = imageFiles[i];
        try {
          const uploadRes = await uploadImage(file, "product");
          const imageUrl =
            uploadRes?.data?.url ??
            uploadRes?.data?.image ??
            uploadRes?.url ??
            "";

          if (!imageUrl) {
            toast.error(`Ảnh ${i + 1} (${file.name}) tải lên thất bại`);
            setSubmitting(false);
            return;
          }
          uploadedUrls.push(imageUrl);
        } catch (uploadErr) {
          const msg =
            uploadErr?.response?.data?.message ||
            uploadErr?.message ||
            "Lỗi không xác định";
          toast.error(`Ảnh ${i + 1} (${file.name}): ${msg}`);
          setSubmitting(false);
          return;
        }
      }

      const allImages = [...existingImages, ...uploadedUrls];

      const finalPayload = {
        category: data.category,
        description: data.description,
        discount: data.discount ? Number(data.discount) : null,
        image: allImages,
        more_details: data.moreDetails,
        name: data.name,
        price: Number(data.price),
        stock: data.stock ? Number(data.stock) : 0,
        subCategory: data.subCategory,
        unit: data.unit,
      };

      const finalParsed = productSchema.safeParse(finalPayload);
      if (!finalParsed.success) {
        const messages = finalParsed.error.errors.map(
          (err) => `${err.path.join(".")}: ${err.message}`,
        );
        for (const msg of messages) {
          toast.error(msg);
        }
        setSubmitting(false);
        return;
      }

      const apiConfig = isEditMode
        ? {
            ...SummaryApi.updateProduct,
            data: { _id: productId, ...finalParsed.data },
          }
        : { ...SummaryApi.createProduct, data: finalParsed.data };

      const response = await Axios(apiConfig);

      if (response.data.success) {
        successAlert({
          message:
            response.data.message ||
            (isEditMode
              ? "Cập nhật sản phẩm thành công"
              : "Tạo sản phẩm thành công"),
          title: "Thành công",
        });
        imagePreviews.forEach((url) => {
          URL.revokeObjectURL(url);
        });
        if (!isEditMode) {
          setData({
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
          setExistingImages([]);
          setImagePreviews([]);
          setImageFiles([]);
        }
        setErrors({});
      }
    } catch (error) {
      const serverMsg = error?.response?.data?.message;
      if (serverMsg) {
        toast.error(serverMsg);
      } else if (error?.response?.status === 413) {
        toast.error("File ảnh quá lớn, vui lòng chọn ảnh nhỏ hơn");
      } else if (error?.response?.status === 500) {
        toast.error("Lỗi máy chủ, vui lòng thử lại sau");
      } else if (!error?.response) {
        toast.error("Không kết nối được máy chủ, vui lòng kiểm tra mạng");
      } else {
        toast.error("Đã có lỗi xảy ra, vui lòng thử lại");
      }
    }

    setSubmitting(false);
  };

  const handleUploadImage = (e) => {
    const files = Array.from(e.target.files ?? []);

    if (files.length === 0) return;

    const invalid = files.find((file) => !ALLOWED_TYPES.includes(file.type));
    if (invalid) {
      toast.error("Chỉ chấp nhận ảnh JPG, PNG, WEBP hoặc GIF");
      e.target.value = "";
      return;
    }

    const currentCount = existingImages.length + imageFiles.length;
    if (currentCount >= MAX_IMAGES) {
      toast.error(`Tối đa ${MAX_IMAGES} ảnh cho mỗi sản phẩm`);
      e.target.value = "";
      return;
    }

    const remaining = MAX_IMAGES - currentCount;
    const acceptedFiles = files.slice(0, remaining);

    if (files.length > remaining) {
      toast.error(
        `Chỉ thêm được ${remaining} ảnh nữa (tối đa ${MAX_IMAGES} ảnh)`,
      );
    }

    const newPreviews = acceptedFiles.map((file) => URL.createObjectURL(file));

    setImageFiles((prev) => [...prev, ...acceptedFiles]);
    setImagePreviews((prev) => [...prev, ...newPreviews]);
    if (errors.image) {
      setErrors((prev) => ({ ...prev, image: undefined }));
    }
    e.target.value = "";
  };

  const handleDeleteExistingImage = (index) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDeleteNewImage = (index) => {
    URL.revokeObjectURL(imagePreviews[index]);

    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const inputClass = (fieldName) =>
    `h-11 rounded-lg border bg-blue-50/40 px-3 text-secondary-100 outline-none transition-colors focus-visible:ring-2 ${
      errors[fieldName]
        ? "border-red-400 focus-visible:border-red-500 focus-visible:ring-red-200"
        : "border-gray-300 focus-visible:border-primary-200 focus-visible:ring-primary-200"
    } ${submitting ? "pointer-events-none opacity-50" : ""}`;

  const selectClass = (fieldName) =>
    `h-11 w-full rounded-lg border bg-blue-50/40 px-3 text-secondary-100 outline-none transition-colors focus-visible:ring-2 ${
      errors[fieldName]
        ? "border-red-400 focus-visible:border-red-500 focus-visible:ring-red-200"
        : "border-gray-300 focus-visible:border-primary-200 focus-visible:ring-primary-200"
    } ${submitting ? "pointer-events-none opacity-50" : ""}`;

  if (loadingProduct) {
    return (
      <section className="rounded-xl bg-white p-3 shadow-md sm:p-4">
        <div className="flex min-h-[78vh] items-center justify-center">
          <Loader2 className="animate-spin text-gray-400" size={32} />
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-xl bg-white p-3 shadow-md sm:p-4">
      <div className="border-gray-200 border-b pb-3">
        <h2 className="font-semibold text-lg text-secondary-100 lg:text-xl">
          {isEditMode ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm"}
        </h2>
      </div>

      <form className="min-h-[78vh] space-y-4 pt-4" onSubmit={handleSubmit}>
        <div className="grid gap-1.5">
          <label
            className="font-medium text-secondary-100 text-sm"
            htmlFor="productName"
          >
            Tên sản phẩm
          </label>
          <input
            aria-describedby={errors.name ? "name-error" : undefined}
            aria-invalid={Boolean(errors.name)}
            className={inputClass("name")}
            disabled={submitting}
            id="productName"
            name="name"
            onChange={handleOnChange}
            placeholder="Nhập tên sản phẩm"
            type="text"
            value={data.name}
          />
          {errors.name && (
            <p className="text-red-500 text-xs" id="name-error" role="alert">
              {errors.name}
            </p>
          )}
        </div>

        <div className="grid gap-1.5">
          <label
            className="font-medium text-secondary-100 text-sm"
            htmlFor="productDescription"
          >
            Mô tả
          </label>
          <textarea
            aria-describedby={
              errors.description ? "description-error" : undefined
            }
            aria-invalid={Boolean(errors.description)}
            className={`min-h-24 rounded-lg border bg-blue-50/40 px-3 py-2 text-secondary-100 outline-none transition-colors focus-visible:ring-2 ${
              errors.description
                ? "border-red-400 focus-visible:border-red-500 focus-visible:ring-red-200"
                : "border-gray-300 focus-visible:border-primary-200 focus-visible:ring-primary-200"
            } ${submitting ? "pointer-events-none opacity-50" : ""}`}
            disabled={submitting}
            id="productDescription"
            name="description"
            onChange={handleOnChange}
            placeholder="Nhập mô tả sản phẩm"
            value={data.description}
          />
          {errors.description && (
            <p
              className="text-red-500 text-xs"
              id="description-error"
              role="alert"
            >
              {errors.description}
            </p>
          )}
        </div>

        <div className="grid gap-1.5">
          <span className="font-medium text-secondary-100 text-sm">
            Hình ảnh
          </span>

          <label
            className={`flex h-32 w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed bg-gray-50/50 transition-colors ${
              errors.image ? "border-red-400" : "border-gray-300"
            } ${submitting ? "pointer-events-none cursor-not-allowed opacity-50" : "cursor-pointer hover:border-primary-200 hover:bg-primary-50"}`}
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
              disabled={submitting}
              id="productImage"
              multiple
              onChange={handleUploadImage}
              type="file"
            />
          </label>

          {errors.image && (
            <p className="text-red-500 text-xs" id="image-error" role="alert">
              {errors.image}
            </p>
          )}

          {(existingImages.length > 0 || imagePreviews.length > 0) && (
            <div
              className={`flex flex-wrap gap-4 ${submitting ? "pointer-events-none opacity-50" : ""}`}
            >
              {existingImages.map((img, index) => (
                <div
                  className="group relative rounded-lg border border-gray-200"
                  key={`existing-${img}`}
                >
                  <button
                    className="block cursor-pointer rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-primary-200"
                    onClick={() => setViewImageURL(img)}
                    type="button"
                  >
                    <img
                      alt={`Ảnh sản phẩm ${index + 1}`}
                      className="h-24 w-24 rounded-lg object-scale-down"
                      draggable="false"
                      src={img}
                    />
                  </button>
                  <button
                    aria-label={`Xóa ảnh ${index + 1}`}
                    className={`absolute top-2 right-2 items-center justify-center rounded-lg bg-red-600 p-1.5 text-white transition-colors hover:bg-red-700 focus-visible:flex focus-visible:ring-2 focus-visible:ring-red-600 ${submitting ? "pointer-events-none hidden cursor-not-allowed opacity-50" : "hidden cursor-pointer group-hover:flex"}`}
                    disabled={submitting}
                    onClick={() => handleDeleteExistingImage(index)}
                    type="button"
                  >
                    <Trash2 aria-hidden="true" size={14} />
                  </button>
                </div>
              ))}

              {imagePreviews.map((preview, index) => (
                <div
                  className="group relative rounded-lg border border-gray-200"
                  key={`new-${preview}`}
                >
                  <button
                    className="block cursor-pointer rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-primary-200"
                    onClick={() => setViewImageURL(preview)}
                    type="button"
                  >
                    <img
                      alt={`Ảnh mới ${index + 1}`}
                      className="h-24 w-24 rounded-lg object-scale-down"
                      draggable="false"
                      src={preview}
                    />
                  </button>
                  <button
                    aria-label={`Xóa ảnh mới ${index + 1}`}
                    className={`absolute top-2 right-2 items-center justify-center rounded-lg bg-red-600 p-1.5 text-white transition-colors hover:bg-red-700 focus-visible:flex focus-visible:ring-2 focus-visible:ring-red-600 ${submitting ? "pointer-events-none hidden cursor-not-allowed opacity-50" : "hidden cursor-pointer group-hover:flex"}`}
                    disabled={submitting}
                    onClick={() => handleDeleteNewImage(index)}
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
            aria-describedby={errors.category ? "category-error" : undefined}
            aria-invalid={Boolean(errors.category)}
            className={selectClass("category")}
            disabled={submitting}
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
          {errors.category && (
            <p
              className="text-red-500 text-xs"
              id="category-error"
              role="alert"
            >
              {errors.category}
            </p>
          )}

          {data.category.length > 0 && (
            <div
              className={`mt-2 flex flex-wrap gap-2 ${submitting ? "pointer-events-none opacity-50" : ""}`}
            >
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
                      className={`rounded-full outline-none transition-colors focus-visible:ring-2 focus-visible:ring-red-600 ${submitting ? "cursor-not-allowed" : "cursor-pointer hover:text-red-600"}`}
                      disabled={submitting}
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
            aria-describedby={
              errors.subCategory ? "subCategory-error" : undefined
            }
            aria-invalid={Boolean(errors.subCategory)}
            className={selectClass("subCategory")}
            disabled={submitting}
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
          {errors.subCategory && (
            <p
              className="text-red-500 text-xs"
              id="subCategory-error"
              role="alert"
            >
              {errors.subCategory}
            </p>
          )}

          {data.subCategory.length > 0 && (
            <div
              className={`mt-2 flex flex-wrap gap-2 ${submitting ? "pointer-events-none opacity-50" : ""}`}
            >
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
                      className={`rounded-full outline-none transition-colors focus-visible:ring-2 focus-visible:ring-red-600 ${submitting ? "cursor-not-allowed" : "cursor-pointer hover:text-red-600"}`}
                      disabled={submitting}
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

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="grid gap-1.5">
            <label
              className="font-medium text-secondary-100 text-sm"
              htmlFor="productUnit"
            >
              Đơn vị
            </label>
            <select
              aria-describedby={errors.unit ? "unit-error" : undefined}
              aria-invalid={Boolean(errors.unit)}
              className={selectClass("unit")}
              disabled={submitting}
              id="productUnit"
              name="unit"
              onChange={handleOnChange}
              value={data.unit}
            >
              <option value="">Chọn đơn vị</option>
              {PRODUCT_UNITS.map((unit) => (
                <option key={unit} value={unit}>
                  {unit}
                </option>
              ))}
            </select>
            {errors.unit && (
              <p className="text-red-500 text-xs" id="unit-error" role="alert">
                {errors.unit}
              </p>
            )}
          </div>

          <div className="grid gap-1.5">
            <label
              className="font-medium text-secondary-100 text-sm"
              htmlFor="productStock"
            >
              Tồn kho
            </label>
            <input
              aria-describedby={errors.stock ? "stock-error" : undefined}
              aria-invalid={Boolean(errors.stock)}
              className={inputClass("stock")}
              disabled={submitting}
              id="productStock"
              min="0"
              name="stock"
              onChange={handleOnChange}
              onKeyDown={(e) =>
                ["-", "+", "e", "E"].includes(e.key) && e.preventDefault()
              }
              placeholder="Số lượng"
              type="number"
              value={data.stock}
            />
            {errors.stock && (
              <p className="text-red-500 text-xs" id="stock-error" role="alert">
                {errors.stock}
              </p>
            )}
          </div>

          <div className="grid gap-1.5">
            <label
              className="font-medium text-secondary-100 text-sm"
              htmlFor="productPrice"
            >
              Giá
            </label>
            <input
              aria-describedby={errors.price ? "price-error" : undefined}
              aria-invalid={Boolean(errors.price)}
              className={inputClass("price")}
              disabled={submitting}
              id="productPrice"
              min="0"
              name="price"
              onChange={handleOnChange}
              onKeyDown={(e) =>
                ["-", "+", "e", "E"].includes(e.key) && e.preventDefault()
              }
              placeholder="Giá bán"
              type="number"
              value={data.price}
            />
            {errors.price && (
              <p className="text-red-500 text-xs" id="price-error" role="alert">
                {errors.price}
              </p>
            )}
          </div>

          <div className="grid gap-1.5">
            <label
              className="font-medium text-secondary-100 text-sm"
              htmlFor="productDiscount"
            >
              Giảm giá
            </label>
            <input
              aria-describedby={errors.discount ? "discount-error" : undefined}
              aria-invalid={Boolean(errors.discount)}
              className={inputClass("discount")}
              disabled={submitting}
              id="productDiscount"
              max="100"
              min="0"
              name="discount"
              onChange={handleOnChange}
              onKeyDown={(e) =>
                ["-", "+", "e", "E"].includes(e.key) && e.preventDefault()
              }
              placeholder="Phần trăm giảm"
              type="number"
              value={data.discount}
            />
            {errors.discount && (
              <p
                className="text-red-500 text-xs"
                id="discount-error"
                role="alert"
              >
                {errors.discount}
              </p>
            )}
          </div>
        </div>

        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <span className="font-medium text-secondary-100 text-sm">
              Thông tin bổ sung
            </span>
            <button
              className={`flex cursor-pointer items-center gap-1.5 rounded border px-3 py-1.5 font-medium text-secondary-100 text-sm outline-none transition-all focus-visible:ring-2 focus-visible:ring-primary-200 ${submitting ? "pointer-events-none cursor-not-allowed border-gray-200 opacity-50" : "border-primary-200 hover:bg-primary-200"}`}
              disabled={submitting}
              onClick={() => setOpenAddField(true)}
              type="button"
            >
              <Plus aria-hidden="true" size={14} />
              Thêm trường
            </button>
          </div>

          {Object.keys(data.moreDetails).length > 0 && (
            <div
              className={`grid gap-3 ${submitting ? "pointer-events-none opacity-50" : ""}`}
            >
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
                      className={`rounded p-1 text-red-600 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-red-600 ${submitting ? "cursor-not-allowed" : "cursor-pointer hover:bg-red-50"}`}
                      disabled={submitting}
                      onClick={() => handleRemoveField(key)}
                      type="button"
                    >
                      <Trash2 aria-hidden="true" size={16} />
                    </button>
                  </div>
                  <input
                    className={`h-11 rounded-lg border bg-blue-50/40 px-3 text-secondary-100 outline-none transition-colors focus-visible:border-primary-200 focus-visible:ring-2 focus-visible:ring-primary-200 ${submitting ? "pointer-events-none border-gray-200 opacity-50" : "border-gray-300"}`}
                    disabled={submitting}
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

        <div className="flex gap-3">
          <button
            className={`flex h-11 flex-1 items-center justify-center gap-2 rounded-full border border-gray-300 font-semibold text-gray-600 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-primary-200 ${
              submitting
                ? "pointer-events-none cursor-not-allowed opacity-50"
                : "cursor-pointer hover:bg-gray-50"
            }`}
            disabled={submitting}
            onClick={() => navigate("/dashboard/product")}
            type="button"
          >
            <X aria-hidden="true" size={18} />
            Hủy
          </button>
          <button
            className="flex h-11 flex-1 cursor-pointer items-center justify-center gap-2 rounded-full bg-green-600 font-semibold text-white outline-none transition-colors hover:bg-green-700 focus-visible:ring-2 focus-visible:ring-green-800 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500"
            disabled={submitting}
            type="submit"
          >
            {submitting ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                {isEditMode ? "Đang lưu..." : "Đang tạo sản phẩm..."}
              </>
            ) : isEditMode ? (
              <>
                <Pencil aria-hidden="true" size={18} />
                Lưu thay đổi
              </>
            ) : (
              <>
                <Send aria-hidden="true" size={18} />
                Tạo sản phẩm
              </>
            )}
          </button>
        </div>
      </form>

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
