import { Plus, X } from "lucide-react";
import { useState } from "react";
import { IoClose } from "react-icons/io5";

const AddFieldComponent = ({ close, onAdd }) => {
  const [fieldName, setFieldName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(fieldName.trim());
    setFieldName("");
  };

  return (
    <section
      aria-labelledby="add-field-title"
      aria-modal="true"
      className="fixed inset-0 z-[70] flex items-center justify-center bg-neutral-800/70 p-4"
      role="dialog"
    >
      <form
        className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl"
        onSubmit={handleSubmit}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2
            className="font-bold text-lg text-secondary-100"
            id="add-field-title"
          >
            Thêm trường dữ liệu
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

        <div className="grid gap-1.5">
          <label
            className="font-medium text-secondary-100 text-sm"
            htmlFor="fieldName"
          >
            Tên trường
          </label>
          <input
            className="h-11 rounded-lg border border-gray-300 bg-blue-50/40 px-3 text-secondary-100 outline-none transition-colors focus-visible:border-primary-200 focus-visible:ring-2 focus-visible:ring-primary-200"
            id="fieldName"
            onChange={(e) => setFieldName(e.target.value)}
            placeholder="Ví dụ: Return Policy, Warranty"
            type="text"
            value={fieldName}
          />
        </div>

        <div className="mt-4 flex gap-3">
          <button
            className="flex h-11 flex-1 cursor-pointer items-center justify-center gap-2 rounded-full border border-gray-300 font-semibold text-gray-600 outline-none transition-colors hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-primary-200"
            onClick={close}
            type="button"
          >
            <X aria-hidden="true" size={18} />
            Hủy
          </button>
          <button
            className="flex h-11 flex-1 cursor-pointer items-center justify-center gap-2 rounded-full bg-green-600 font-semibold text-white outline-none transition-colors hover:bg-green-700 focus-visible:ring-2 focus-visible:ring-green-800 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500"
            disabled={!fieldName.trim()}
            type="submit"
          >
            <Plus aria-hidden="true" size={18} />
            Thêm
          </button>
        </div>
      </form>
    </section>
  );
};

export default AddFieldComponent;
