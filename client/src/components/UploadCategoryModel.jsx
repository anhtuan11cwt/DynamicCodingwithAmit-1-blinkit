import { Camera, Loader2, Trash2, Upload, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { IoClose } from "react-icons/io5";
import SummaryApi from "../common/SummaryApi";
import AxiosToastError from "../utils/AxiosToastError";
import Axios from "../utils/axios";
import uploadImage from "../utils/uploadImage";
import { categorySchema } from "../validations/category.validation";

const ALLOWED_TYPES = ["image/gif", "image/jpeg", "image/png", "image/webp"];

const UploadCategoryModel = ({ close, onSuccess }) => {
  const [data, setData] = useState({
    imageFile: null,
    imagePreview: "",
    name: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const previewUrlRef = useRef(null);

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, []);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectImage = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error("Chỉ chấp nhận ảnh JPG, PNG, WEBP hoặc GIF");
      return;
    }

    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
    }

    const objectUrl = URL.createObjectURL(file);
    previewUrlRef.current = objectUrl;

    setData((prev) => ({
      ...prev,
      imageFile: file,
      imagePreview: objectUrl,
    }));
  };

  const handleRemoveImage = () => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }

    setData((prev) => ({
      ...prev,
      imageFile: null,
      imagePreview: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!data.name || !data.imageFile) {
      toast.error("Vui lòng nhập tên và chọn ảnh danh mục");
      return;
    }

    try {
      setSubmitting(true);

      const uploadRes = await uploadImage(data.imageFile, "category");
      const imageUrl =
        uploadRes?.data?.url ?? uploadRes?.data?.image ?? uploadRes?.url ?? "";

      if (!imageUrl) {
        toast.error("Tải ảnh lên thất bại");
        return;
      }

      const payload = { image: imageUrl, name: data.name };
      const parsed = categorySchema.safeParse(payload);

      if (!parsed.success) {
        toast.error(parsed.error.errors[0]?.message || "Dữ liệu không hợp lệ");
        return;
      }

      const response = await Axios({
        ...SummaryApi.addCategory,
        data: payload,
      });

      if (response.data.success) {
        toast.success(response.data.message);
        handleRemoveImage();
        setData((prev) => ({ ...prev, name: "" }));
        onSuccess?.();
        close();
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      aria-labelledby="upload-category-title"
      aria-modal="true"
      className="fixed inset-0 z-[70] flex items-center justify-center bg-neutral-800/70 p-4"
      role="dialog"
    >
      <div className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2
            className="font-bold text-lg text-secondary-100"
            id="upload-category-title"
          >
            Tải lên danh mục
          </h2>
          <button
            aria-label="Đóng"
            className={`flex items-center justify-center rounded-lg p-2 text-secondary-100 outline-none transition-colors hover:bg-gray-100 focus-visible:ring-2 focus-visible:ring-primary-200 ${
              submitting
                ? "pointer-events-none cursor-not-allowed opacity-50"
                : "cursor-pointer"
            }`}
            disabled={submitting}
            onClick={close}
            type="button"
          >
            <IoClose aria-hidden="true" size={24} />
          </button>
        </div>

        <form className="grid gap-4" onSubmit={handleSubmit}>
          <div className="grid gap-1.5">
            <label
              className="font-medium text-secondary-100 text-sm"
              htmlFor="categoryName"
            >
              Tên danh mục
            </label>
            <input
              className={`h-11 rounded-lg border bg-blue-50/40 px-3 text-secondary-100 outline-none transition-colors focus-visible:border-primary-200 focus-visible:ring-2 focus-visible:ring-primary-200 ${
                submitting
                  ? "pointer-events-none border-gray-200 opacity-50"
                  : "border-gray-300"
              }`}
              disabled={submitting}
              id="categoryName"
              name="name"
              onChange={handleOnChange}
              placeholder="Nhập tên danh mục"
              required
              type="text"
              value={data.name}
            />
          </div>

          <div className="grid gap-1.5">
            <span className="font-medium text-secondary-100 text-sm">
              Hình ảnh
            </span>

            {data.imagePreview ? (
              <div
                className={`relative overflow-hidden rounded-xl border border-gray-200 ${
                  submitting ? "pointer-events-none" : "group"
                }`}
              >
                <img
                  alt={data.name || "Ảnh danh mục"}
                  className="pointer-events-none aspect-video w-full select-none object-cover"
                  draggable="false"
                  src={data.imagePreview}
                />
                <div
                  className={`absolute inset-0 flex items-center justify-center gap-2 bg-black/40 transition-opacity ${
                    submitting ? "hidden" : "opacity-0 group-hover:opacity-100"
                  }`}
                >
                  <label
                    className={`items-center gap-1.5 rounded-lg bg-white/90 px-3 py-2 font-medium text-secondary-100 text-xs backdrop-blur-sm transition-colors hover:bg-white ${
                      submitting
                        ? "pointer-events-none cursor-not-allowed opacity-50"
                        : "flex cursor-pointer"
                    }`}
                    htmlFor="uploadCategoryImageReplace"
                  >
                    <Upload aria-hidden="true" size={14} />
                    Thay đổi
                    <input
                      accept="image/*"
                      className="hidden"
                      disabled={submitting}
                      id="uploadCategoryImageReplace"
                      onChange={handleSelectImage}
                      type="file"
                    />
                  </label>
                  <button
                    className={`items-center gap-1.5 rounded-lg bg-red-500/90 px-3 py-2 font-medium text-white text-xs backdrop-blur-sm transition-colors hover:bg-red-600 ${
                      submitting
                        ? "pointer-events-none cursor-not-allowed opacity-50"
                        : "flex cursor-pointer"
                    }`}
                    disabled={submitting}
                    onClick={handleRemoveImage}
                    type="button"
                  >
                    <Trash2 aria-hidden="true" size={14} />
                    Xoá
                  </button>
                </div>
              </div>
            ) : (
              <label
                className={`flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed bg-gray-50/50 px-4 py-8 transition-colors ${
                  submitting
                    ? "pointer-events-none cursor-not-allowed border-gray-200 opacity-50"
                    : "cursor-pointer border-gray-300 hover:border-primary-200 hover:bg-primary-50"
                }`}
                htmlFor="uploadCategoryImage"
              >
                <Camera
                  aria-hidden="true"
                  className="text-gray-400"
                  size={32}
                />
                <div className="text-center">
                  <p className="font-medium text-secondary-100 text-sm">
                    Nhấn để chọn ảnh
                  </p>
                  <p className="mt-0.5 text-gray-400 text-xs">
                    JPG, PNG, WEBP hoặc GIF
                  </p>
                </div>
                <input
                  accept="image/*"
                  className="hidden"
                  disabled={submitting}
                  id="uploadCategoryImage"
                  onChange={handleSelectImage}
                  type="file"
                />
              </label>
            )}
          </div>

          <div className="mt-1 flex gap-3">
            <button
              className={`flex h-11 flex-1 items-center justify-center gap-2 rounded-full border border-gray-300 font-semibold text-gray-600 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-primary-200 ${
                submitting
                  ? "pointer-events-none cursor-not-allowed opacity-50"
                  : "cursor-pointer hover:bg-gray-50"
              }`}
              disabled={submitting}
              onClick={close}
              type="button"
            >
              <X aria-hidden="true" size={18} />
              Hủy
            </button>
            <button
              className={`flex h-11 flex-1 items-center justify-center gap-2 rounded-full bg-green-600 font-semibold text-white outline-none transition-colors duration-200 hover:bg-green-700 focus-visible:ring-2 focus-visible:ring-green-800 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500 ${
                submitting ? "pointer-events-none opacity-50" : "cursor-pointer"
              }`}
              disabled={submitting || !data.name || !data.imageFile}
              type="submit"
            >
              {submitting ? (
                <Loader2
                  aria-hidden="true"
                  className="animate-spin"
                  size={18}
                />
              ) : (
                <Upload aria-hidden="true" size={18} />
              )}
              {submitting ? "Đang thêm..." : "Thêm danh mục"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default UploadCategoryModel;
