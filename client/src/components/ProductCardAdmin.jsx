import { Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ProductCardAdmin = ({ data, onDelete }) => {
  const navigate = useNavigate();

  return (
    <div className="group relative overflow-hidden rounded-lg bg-white shadow duration-300 hover:shadow-lg">
      <img
        alt={data.name}
        className="h-40 w-full object-cover"
        src={data.image?.[0]}
      />

      <div className="p-3">
        <p className="line-clamp-2 font-medium">{data.name}</p>

        <p className="mt-2 text-gray-500 text-sm">{data.unit}</p>
      </div>

      <div className="absolute inset-x-0 bottom-0 hidden gap-2 bg-white/95 p-2 backdrop-blur-sm group-focus-within:flex group-hover:flex">
        <button
          className="flex flex-1 cursor-pointer items-center justify-center gap-1 rounded-md bg-green-100 py-1.5 font-medium text-green-700 text-xs outline-none transition-colors hover:bg-green-200 focus-visible:ring-2 focus-visible:ring-green-600"
          onClick={() => navigate(`/dashboard/edit-product/${data._id}`)}
          type="button"
        >
          <Pencil aria-hidden="true" size={14} />
          Sửa
        </button>
        <button
          className="flex flex-1 cursor-pointer items-center justify-center gap-1 rounded-md bg-red-100 py-1.5 font-medium text-red-700 text-xs outline-none transition-colors hover:bg-red-200 focus-visible:ring-2 focus-visible:ring-red-600"
          onClick={() => onDelete?.(data)}
          type="button"
        >
          <Trash2 aria-hidden="true" size={14} />
          Xóa
        </button>
      </div>
    </div>
  );
};

export default ProductCardAdmin;
