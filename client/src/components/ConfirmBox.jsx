import { Loader2, Trash2, X } from "lucide-react";
import { IoClose } from "react-icons/io5";

const ConfirmBox = ({
  cancelText = "Hủy",
  confirmText = "Xóa",
  loading = false,
  message = "Hành động này không thể hoàn tác.",
  onCancel,
  onConfirm,
  title = "Bạn có chắc chắn?",
}) => {
  return (
    <section
      aria-labelledby="confirm-box-title"
      aria-modal="true"
      className="fixed inset-0 z-[80] flex items-center justify-center bg-neutral-800/70 p-4"
      role="alertdialog"
    >
      <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl">
        <div className="mb-2 flex items-start justify-between gap-3">
          <h2
            className="font-bold text-lg text-secondary-100"
            id="confirm-box-title"
          >
            {title}
          </h2>
          <button
            aria-label="Đóng"
            className={`flex items-center justify-center rounded-lg p-1.5 text-secondary-100 outline-none transition-colors hover:bg-gray-100 focus-visible:ring-2 focus-visible:ring-primary-200 ${
              loading
                ? "pointer-events-none cursor-not-allowed opacity-50"
                : "cursor-pointer"
            }`}
            disabled={loading}
            onClick={onCancel}
            type="button"
          >
            <IoClose aria-hidden="true" size={20} />
          </button>
        </div>

        <p className="text-gray-600 text-sm">{message}</p>

        <div className="mt-5 flex gap-3">
          <button
            className={`flex h-11 flex-1 items-center justify-center gap-2 rounded-full border border-gray-300 font-semibold text-gray-600 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-primary-200 ${
              loading
                ? "pointer-events-none cursor-not-allowed opacity-50"
                : "cursor-pointer hover:bg-gray-50"
            }`}
            disabled={loading}
            onClick={onCancel}
            type="button"
          >
            <X aria-hidden="true" size={18} />
            {cancelText}
          </button>
          <button
            className={`flex h-11 flex-1 items-center justify-center gap-2 rounded-full bg-red-600 font-semibold text-white outline-none transition-colors hover:bg-red-700 focus-visible:ring-2 focus-visible:ring-red-800 focus-visible:ring-offset-2 ${
              loading ? "pointer-events-none opacity-70" : "cursor-pointer"
            }`}
            disabled={loading}
            onClick={onConfirm}
            type="button"
          >
            {loading ? (
              <Loader2 aria-hidden="true" className="animate-spin" size={18} />
            ) : (
              <Trash2 aria-hidden="true" size={18} />
            )}
            {loading ? "Đang xóa..." : confirmText}
          </button>
        </div>
      </div>
    </section>
  );
};

export default ConfirmBox;
