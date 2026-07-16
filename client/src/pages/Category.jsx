import { Pencil, Plus, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import SummaryApi from "../common/SummaryApi";
import ConfirmBox from "../components/ConfirmBox";
import EditCategory from "../components/EditCategory";
import Loading from "../components/Loading";
import NoData from "../components/NoData";
import UploadCategoryModel from "../components/UploadCategoryModel";
import AxiosToastError from "../utils/AxiosToastError";
import Axios from "../utils/axios";

const Category = () => {
  const [openUploadCategory, setOpenUploadCategory] = useState(false);
  const [categoryData, setCategoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editData, setEditData] = useState(null);
  const [deleteData, setDeleteData] = useState(null);
  const [deleting, setDeleting] = useState(false);

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

  const handleDeleteCategory = async () => {
    if (!deleteData) return;

    try {
      setDeleting(true);
      const response = await Axios({
        ...SummaryApi.deleteCategory,
        data: { _id: deleteData._id },
      });

      if (response.data.success) {
        toast.success(response.data.message);
        setDeleteData(null);
        fetchCategory();
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setDeleting(false);
    }
  };

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
                className="group relative flex h-full flex-col overflow-hidden rounded-lg border border-gray-100 bg-white shadow transition-all duration-300 hover:shadow-lg"
                key={category._id}
              >
                <div className="aspect-square w-full shrink-0 overflow-hidden bg-gray-50 p-3">
                  <img
                    alt={category.name}
                    className="h-full w-full object-contain"
                    loading="lazy"
                    src={category.image}
                  />
                </div>
                <p className="mt-auto truncate px-2 py-2 text-center font-medium text-secondary-100 text-sm">
                  {category.name}
                </p>

                <div className="absolute inset-x-0 bottom-0 hidden gap-2 bg-white/95 p-2 backdrop-blur-sm group-focus-within:flex group-hover:flex">
                  <button
                    className="flex flex-1 cursor-pointer items-center justify-center gap-1 rounded-md bg-green-100 py-1.5 font-medium text-green-700 text-xs outline-none transition-colors hover:bg-green-200 focus-visible:ring-2 focus-visible:ring-green-600"
                    onClick={() => setEditData(category)}
                    type="button"
                  >
                    <Pencil aria-hidden="true" size={14} />
                    Sửa
                  </button>
                  <button
                    className="flex flex-1 cursor-pointer items-center justify-center gap-1 rounded-md bg-red-100 py-1.5 font-medium text-red-700 text-xs outline-none transition-colors hover:bg-red-200 focus-visible:ring-2 focus-visible:ring-red-600"
                    onClick={() => setDeleteData(category)}
                    type="button"
                  >
                    <Trash2 aria-hidden="true" size={14} />
                    Xóa
                  </button>
                </div>
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

      {editData && (
        <EditCategory
          close={() => setEditData(null)}
          dataCategory={editData}
          onSuccess={fetchCategory}
        />
      )}

      {deleteData && (
        <ConfirmBox
          loading={deleting}
          message={`Xóa danh mục "${deleteData.name}"? Hành động này không thể hoàn tác.`}
          onCancel={() => setDeleteData(null)}
          onConfirm={handleDeleteCategory}
          title="Xóa danh mục"
        />
      )}
    </section>
  );
};

export default Category;
