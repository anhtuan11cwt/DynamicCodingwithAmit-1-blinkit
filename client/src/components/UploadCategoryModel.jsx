import { Camera, Loader2, Trash2, Upload } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { IoClose } from "react-icons/io5";
import AxiosToastError from "../utils/AxiosToastError";
import uploadImage from "../utils/uploadImage";

const ALLOWED_TYPES = ["image/gif", "image/jpeg", "image/png", "image/webp"];

const UploadCategoryModel = ({ close }) => {
  const [data, setData] = useState({
    image: "",
    name: "",
  });
  const [loading, setLoading] = useState(false);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUploadCategoryImage = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error("Chỉ chấp nhận ảnh JPG, PNG, WEBP hoặc GIF");
      return;
    }

    try {
      setLoading(true);
      const response = await uploadImage(file);
      const imageUrl =
        response?.data?.url ?? response?.data?.image ?? response?.url ?? "";

      setData((prev) => ({
        ...prev,
        image: imageUrl,
      }));
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveImage = () => {
    setData((prev) => ({ ...prev, image: "" }));
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
            className="flex cursor-pointer items-center justify-center rounded-lg p-2 text-secondary-100 outline-none transition-colors hover:bg-gray-100 focus-visible:ring-2 focus-visible:ring-primary-200"
            onClick={close}
            type="button"
          >
            <IoClose aria-hidden="true" size={24} />
          </button>
        </div>

        <form className="grid gap-4">
          <div className="grid gap-1.5">
            <label
              className="font-medium text-secondary-100 text-sm"
              htmlFor="categoryName"
            >
              Tên danh mục
            </label>
            <input
              className="h-11 rounded-lg border border-gray-300 bg-blue-50/40 px-3 text-secondary-100 outline-none transition-colors focus-visible:border-primary-200 focus-visible:ring-2 focus-visible:ring-primary-200"
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

            {data.image ? (
              <div className="group relative overflow-hidden rounded-xl border border-gray-200">
                <img
                  alt={data.name || "Ảnh danh mục"}
                  className="aspect-video w-full object-cover"
                  src={data.image}
                />
                <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                  <label
                    className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-white/90 px-3 py-2 font-medium text-secondary-100 text-xs backdrop-blur-sm transition-colors hover:bg-white"
                    htmlFor="uploadCategoryImageReplace"
                  >
                    <Upload aria-hidden="true" size={14} />
                    Thay đổi
                    <input
                      accept="image/*"
                      className="hidden"
                      disabled={loading}
                      id="uploadCategoryImageReplace"
                      onChange={handleUploadCategoryImage}
                      type="file"
                    />
                  </label>
                  <button
                    className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-red-500/90 px-3 py-2 font-medium text-white text-xs backdrop-blur-sm transition-colors hover:bg-red-600"
                    onClick={handleRemoveImage}
                    type="button"
                  >
                    <Trash2 aria-hidden="true" size={14} />
                    Xoá
                  </button>
                </div>
                {loading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                    <Loader2
                      aria-hidden="true"
                      className="animate-spin text-white"
                      size={28}
                    />
                  </div>
                )}
              </div>
            ) : (
              <label
                className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-gray-300 border-dashed bg-gray-50/50 px-4 py-8 transition-colors ${
                  loading
                    ? "pointer-events-none cursor-not-allowed border-primary-200 bg-primary-50"
                    : "hover:border-primary-200 hover:bg-primary-50"
                }`}
                htmlFor="uploadCategoryImage"
              >
                {loading ? (
                  <Loader2
                    aria-hidden="true"
                    className="animate-spin text-primary-200"
                    size={32}
                  />
                ) : (
                  <Camera
                    aria-hidden="true"
                    className="text-gray-400"
                    size={32}
                  />
                )}
                <div className="text-center">
                  <p className="font-medium text-secondary-100 text-sm">
                    {loading ? "Đang tải ảnh lên..." : "Nhấn để tải ảnh lên"}
                  </p>
                  <p className="mt-0.5 text-gray-400 text-xs">
                    JPG, PNG, WEBP hoặc GIF
                  </p>
                </div>
                <input
                  accept="image/*"
                  className="hidden"
                  disabled={loading}
                  id="uploadCategoryImage"
                  onChange={handleUploadCategoryImage}
                  type="file"
                />
              </label>
            )}
          </div>

          <button
            className="mt-1 h-11 rounded-lg bg-primary-200 font-semibold text-secondary-100 outline-none transition-colors hover:bg-primary-100 focus-visible:ring-2 focus-visible:ring-primary-200 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400"
            disabled={loading || !data.name || !data.image}
            type="submit"
          >
            Thêm danh mục
          </button>
        </form>
      </div>
    </section>
  );
};

export default UploadCategoryModel;
