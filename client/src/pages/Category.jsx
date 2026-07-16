import { Plus } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import SummaryApi from "../common/SummaryApi";
import Loading from "../components/Loading";
import NoData from "../components/NoData";
import UploadCategoryModel from "../components/UploadCategoryModel";
import AxiosToastError from "../utils/AxiosToastError";
import Axios from "../utils/axios";

const Category = () => {
  const [openUploadCategory, setOpenUploadCategory] = useState(false);
  const [categoryData, setCategoryData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCategory = useCallback(async () => {
    setLoading(true);
    try {
      const response = await Axios({ ...SummaryApi.getCategory });

      if (response.data.success) {
        setCategoryData(response.data.data);
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;

    const loadCategory = async () => {
      try {
        const response = await Axios({ ...SummaryApi.getCategory });
        if (active && response.data.success) {
          setCategoryData(response.data.data);
        }
      } catch (error) {
        AxiosToastError(error);
      } finally {
        if (active) setLoading(false);
      }
    };

    loadCategory();

    return () => {
      active = false;
    };
  }, []);

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
        {loading && <Loading label="Đang tải danh mục..." />}

        {!loading && categoryData.length === 0 && (
          <NoData message="Chưa có danh mục nào" />
        )}

        {!loading && categoryData.length > 0 && (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
            {categoryData.map((category) => (
              <div
                className="flex cursor-pointer flex-col overflow-hidden rounded-lg border border-gray-100 bg-white shadow transition-all duration-300 hover:shadow-lg"
                key={category._id}
              >
                <div className="flex aspect-square items-center justify-center bg-gray-50 p-3">
                  <img
                    alt={category.name}
                    className="h-full w-full object-scale-down"
                    loading="lazy"
                    src={category.image}
                  />
                </div>
                <p className="truncate px-2 py-2 text-center font-medium text-secondary-100 text-sm">
                  {category.name}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {openUploadCategory && (
        <UploadCategoryModel
          close={() => setOpenUploadCategory(false)}
          onSuccess={fetchCategory}
        />
      )}
    </section>
  );
};

export default Category;
