import { Plus } from "lucide-react";
import { useState } from "react";
import UploadCategoryModel from "../components/UploadCategoryModel";

const Category = () => {
  const [openUploadCategory, setOpenUploadCategory] = useState(false);

  return (
    <section className="rounded-xl bg-white p-4 shadow-md">
      <div className="flex items-center justify-between border-gray-200 border-b pb-3">
        <h2 className="font-semibold text-lg text-secondary-100 lg:text-xl">
          Danh mục
        </h2>
        <button
          className="flex cursor-pointer items-center gap-1.5 rounded border border-primary-200 px-4 py-2 font-medium text-secondary-100 text-sm outline-none transition-all hover:bg-primary-200 focus-visible:ring-2 focus-visible:ring-primary-200"
          onClick={() => setOpenUploadCategory(true)}
          type="button"
        >
          <Plus aria-hidden="true" size={16} />
          Thêm danh mục
        </button>
      </div>

      <div className="min-h-[78vh] pt-4">
        <p className="text-gray-500 text-sm">Chưa có danh mục nào.</p>
      </div>

      {openUploadCategory && (
        <UploadCategoryModel close={() => setOpenUploadCategory(false)} />
      )}
    </section>
  );
};

export default Category;
