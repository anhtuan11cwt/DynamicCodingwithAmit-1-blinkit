import { IoClose } from "react-icons/io5";

const UploadCategoryModel = ({ close }) => {
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
      </div>
    </section>
  );
};

export default UploadCategoryModel;
