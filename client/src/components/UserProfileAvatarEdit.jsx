import { Loader2, Upload, X } from "lucide-react";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import SummaryApi from "../common/SummaryApi";
import { updateAvatar } from "../store/userSlice";
import AxiosToastError from "../utils/AxiosToastError";
import Axios from "../utils/axios";

const ALLOWED_TYPES = ["image/gif", "image/jpeg", "image/png", "image/webp"];

const UserProfileAvatarEdit = ({ onClose, open }) => {
  const [selected, setSelected] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef(null);
  const dispatch = useDispatch();

  if (!open) return null;

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error("Chỉ chấp nhận ảnh JPG, PNG, WEBP hoặc GIF");
      return;
    }
    setSelected(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!selected) {
      toast.error("Vui lòng chọn ảnh đại diện");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("avatar", selected);

      const response = await Axios({
        ...SummaryApi.uploadAvatar,
        data: formData,
      });

      if (response.data.success) {
        dispatch(updateAvatar(response.data.data.avatar));
        toast.success(response.data.message);
        onClose();
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      aria-modal="true"
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4"
      role="dialog"
    >
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-bold text-lg text-secondary-100">
            Cập nhật ảnh đại diện
          </h2>
          <button
            aria-label="Đóng"
            className={`flex items-center justify-center rounded-lg p-2 text-secondary-100 outline-none transition-colors hover:bg-gray-100 focus-visible:ring-2 focus-visible:ring-primary-200 ${
              loading
                ? "pointer-events-none cursor-not-allowed opacity-50"
                : "cursor-pointer"
            }`}
            disabled={loading}
            onClick={onClose}
            type="button"
          >
            <X aria-hidden="true" size={20} />
          </button>
        </div>

        <label
          className={`flex flex-col items-center gap-3 rounded-xl border-2 border-gray-200 border-dashed p-6 outline-none transition-colors focus-within:border-primary-200 hover:border-primary-200 ${
            loading
              ? "pointer-events-none cursor-not-allowed opacity-50"
              : "cursor-pointer"
          }`}
        >
          {preview ? (
            <div className="relative">
              <img
                alt="Xem trước ảnh đại diện"
                className="size-28 rounded-full object-cover"
                src={preview}
              />
              <button
                aria-label="Xóa ảnh"
                className="absolute -top-1 -right-1 flex size-6 cursor-pointer items-center justify-center rounded-full bg-red-500 text-white shadow-sm transition-colors hover:bg-red-600"
                onClick={(e) => {
                  e.preventDefault();
                  setPreview(null);
                  setSelected(null);
                  if (fileRef.current) fileRef.current.value = "";
                }}
                type="button"
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <div className="flex size-28 flex-col items-center justify-center gap-1 rounded-full bg-gray-50 text-gray-400">
              <Upload aria-hidden="true" size={26} />
              <span className="text-xs">Chọn ảnh</span>
            </div>
          )}
          <span className="font-medium text-primary-200 text-sm">
            Nhấn để chọn ảnh
          </span>
          <input
            accept="image/*"
            className="hidden"
            disabled={loading}
            onChange={handleFileChange}
            ref={fileRef}
            type="file"
          />
        </label>

        <div className="mt-5 flex gap-3">
          <button
            className={`flex h-11 flex-1 items-center justify-center gap-2 rounded-full border border-gray-300 font-semibold text-gray-600 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-primary-200 ${
              loading
                ? "pointer-events-none cursor-not-allowed opacity-50"
                : "cursor-pointer hover:bg-gray-50"
            }`}
            disabled={loading}
            onClick={onClose}
            type="button"
          >
            <X aria-hidden="true" size={18} />
            Hủy
          </button>
          <button
            className={`flex h-11 flex-1 items-center justify-center gap-2 rounded-full bg-green-600 font-semibold text-white outline-none transition-colors duration-200 hover:bg-green-700 focus-visible:ring-2 focus-visible:ring-green-800 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500 ${
              loading ? "pointer-events-none opacity-50" : "cursor-pointer"
            }`}
            disabled={loading || !selected}
            onClick={handleUpload}
            type="button"
          >
            {loading ? (
              <Loader2 aria-hidden="true" className="animate-spin" size={18} />
            ) : (
              <Upload aria-hidden="true" size={18} />
            )}
            {loading ? "Đang tải..." : "Tải lên"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfileAvatarEdit;
