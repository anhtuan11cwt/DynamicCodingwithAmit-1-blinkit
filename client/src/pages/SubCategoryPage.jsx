import { createColumnHelper } from "@tanstack/react-table";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import SummaryApi from "../common/SummaryApi";
import ConfirmBox from "../components/ConfirmBox";
import DisplayTable from "../components/DisplayTable";
import NoData from "../components/NoData";
import UploadSubCategoryModel from "../components/UploadSubCategoryModel";
import { setAllSubCategory } from "../store/productSlice";
import AxiosToastError from "../utils/AxiosToastError";
import Axios from "../utils/axios";

const columnHelper = createColumnHelper();

const SubCategoryPage = () => {
  const dispatch = useDispatch();
  const allSubCategory = useSelector((state) => state.product.allSubCategory);

  const [openUploadSubCategory, setOpenUploadSubCategory] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteData, setDeleteData] = useState(null);
  const [deleting, setDeleting] = useState(false);

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

  const handleDeleteSubCategory = async () => {
    if (!deleteData) return;

    try {
      setDeleting(true);
      const response = await Axios({
        ...SummaryApi.deleteSubCategory,
        data: { _id: deleteData._id },
      });

      if (response.data.success) {
        toast.success(response.data.message);
        setDeleteData(null);
        refreshSubCategory();
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setDeleting(false);
    }
  };

  const column = [
    columnHelper.accessor("name", {
      header: "Danh mục con",
    }),
    columnHelper.accessor("image", {
      cell: ({ row }) => (
        <img
          alt={row.original.name}
          className="h-12 w-12 rounded object-scale-down"
          src={row.original.image}
        />
      ),
      header: "Hình ảnh",
    }),
    columnHelper.accessor("category", {
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-1">
          {Array.isArray(row.original.category) &&
            row.original.category.map((cat) => (
              <span
                className="rounded-full bg-primary-100 px-2 py-0.5 font-medium text-[11px] text-secondary-100"
                key={cat._id}
              >
                {cat.name}
              </span>
            ))}
        </div>
      ),
      header: "Danh mục cha",
    }),
    columnHelper.display({
      cell: ({ row }) => (
        <div className="flex gap-3">
          <button
            className="cursor-pointer rounded p-1 text-green-600 outline-none transition-colors hover:bg-green-50 hover:text-green-700 focus-visible:ring-2 focus-visible:ring-green-600"
            onClick={() => setEditData(row.original)}
            type="button"
          >
            <Pencil aria-hidden="true" size={18} />
          </button>
          <button
            className="cursor-pointer rounded p-1 text-red-600 outline-none transition-colors hover:bg-red-50 hover:text-red-700 focus-visible:ring-2 focus-visible:ring-red-600"
            onClick={() => setDeleteData(row.original)}
            type="button"
          >
            <Trash2 aria-hidden="true" size={18} />
          </button>
        </div>
      ),
      header: "Hành động",
      id: "action",
    }),
  ];

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
          <DisplayTable columns={column} data={allSubCategory} />
        )}
      </div>

      {openUploadSubCategory && (
        <UploadSubCategoryModel
          close={() => setOpenUploadSubCategory(false)}
          onSuccess={refreshSubCategory}
        />
      )}

      {editData && (
        <UploadSubCategoryModel
          close={() => setEditData(null)}
          data={editData}
          onSuccess={refreshSubCategory}
        />
      )}

      {deleteData && (
        <ConfirmBox
          loading={deleting}
          message={`Xóa danh mục con "${deleteData.name}"? Hành động này không thể hoàn tác.`}
          onCancel={() => setDeleteData(null)}
          onConfirm={handleDeleteSubCategory}
          title="Xóa danh mục con"
        />
      )}
    </section>
  );
};

export default SubCategoryPage;
