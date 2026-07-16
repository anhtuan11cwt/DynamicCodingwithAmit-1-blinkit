import { Plus } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SummaryApi from "../common/SummaryApi";
import NoData from "../components/NoData";
import UploadSubCategoryModel from "../components/UploadSubCategoryModel";
import { setAllSubCategory } from "../store/productSlice";
import AxiosToastError from "../utils/AxiosToastError";
import Axios from "../utils/axios";

const SubCategoryPage = () => {
  const dispatch = useDispatch();
  const allSubCategory = useSelector((state) => state.product.allSubCategory);

  const [openUploadSubCategory, setOpenUploadSubCategory] = useState(false);

  const refreshSubCategory = async () => {
    try {
      const response = await Axios({ ...SummaryApi.getSubCategory });
      if (response.data.success) {
        dispatch(setAllSubCategory(response.data.data));
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  return (
    <section className="rounded-xl bg-white p-4 shadow-md">
      <div className="flex items-center justify-between border-gray-200 border-b pb-3">
        <h2 className="font-semibold text-lg text-secondary-100 lg:text-xl">
          Danh mục con
        </h2>
        <button
          className="flex cursor-pointer items-center gap-1.5 rounded border border-primary-200 px-4 py-2 font-medium text-secondary-100 text-sm outline-none transition-all hover:bg-primary-200 focus-visible:ring-2 focus-visible:ring-primary-200"
          onClick={() => setOpenUploadSubCategory(true)}
          type="button"
        >
          <Plus aria-hidden="true" size={16} />
          Thêm danh mục con
        </button>
      </div>

      <div className="min-h-[78vh] pt-4">
        {allSubCategory.length === 0 ? (
          <NoData message="Chưa có danh mục con nào" />
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
            {allSubCategory.map((subCategory) => (
              <div
                className="flex h-full flex-col overflow-hidden rounded-lg border border-gray-100 bg-white shadow transition-all duration-300 hover:shadow-lg"
                key={subCategory._id}
              >
                <div className="aspect-square w-full shrink-0 overflow-hidden bg-gray-50 p-3">
                  <img
                    alt={subCategory.name}
                    className="h-full w-full object-contain"
                    loading="lazy"
                    src={subCategory.image}
                  />
                </div>
                <p className="mt-1 truncate px-2 py-1 text-center font-medium text-secondary-100 text-sm">
                  {subCategory.name}
                </p>
                <div className="flex flex-wrap justify-center gap-1 px-2 pb-2">
                  {Array.isArray(subCategory.category) &&
                    subCategory.category.map((cat) => (
                      <span
                        className="rounded-full bg-primary-100 px-2 py-0.5 font-medium text-[11px] text-secondary-100"
                        key={cat._id}
                      >
                        {cat.name}
                      </span>
                    ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {openUploadSubCategory && (
        <UploadSubCategoryModel
          close={() => setOpenUploadSubCategory(false)}
          onSuccess={refreshSubCategory}
        />
      )}
    </section>
  );
};

export default SubCategoryPage;
