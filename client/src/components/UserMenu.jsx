import {
  LayoutGrid,
  ListTree,
  LogOut,
  MapPin,
  Package,
  Upload,
  User,
} from "lucide-react";
import { Link } from "react-router-dom";
import isAdmin from "../utils/isAdmin";
import Divider from "./Divider";

const UserMenu = ({ user, onClose, onLogout }) => {
  const displayName = user.name || "Người dùng";
  const initial = (user.name || user.email || "U").charAt(0).toUpperCase();

  return (
    <div className="absolute right-0 z-50 mt-2 w-64 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-lg">
      <div className="flex items-center gap-3 px-4 py-3">
        {user.avatar ? (
          <img
            alt={displayName}
            className="size-11 shrink-0 rounded-full object-cover"
            src={user.avatar}
          />
        ) : (
          <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary-100 font-semibold text-primary-200">
            {initial}
          </span>
        )}
        <div className="min-w-0">
          <p className="truncate font-semibold text-gray-800">
            {displayName}
            {isAdmin(user.role) && (
              <span className="ml-1.5 rounded bg-red-100 px-1.5 py-0.5 font-bold text-[10px] text-red-600 uppercase">
                Quản trị
              </span>
            )}
          </p>
          <p className="truncate text-gray-500 text-sm">{user.email}</p>
        </div>
      </div>

      <Divider />

      {isAdmin(user.role) ? (
        <nav aria-label="Quản trị" className="py-1">
          <Link
            className="flex cursor-pointer items-center gap-2 px-4 py-2.5 text-gray-700 text-sm outline-none transition-colors hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-primary-200"
            onClick={onClose}
            to="/dashboard/category"
          >
            <LayoutGrid aria-hidden="true" size={18} />
            Danh mục
          </Link>
          <Link
            className="flex cursor-pointer items-center gap-2 px-4 py-2.5 text-gray-700 text-sm outline-none transition-colors hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-primary-200"
            onClick={onClose}
            to="/dashboard/subcategory"
          >
            <ListTree aria-hidden="true" size={18} />
            Danh mục con
          </Link>
          <Link
            className="flex cursor-pointer items-center gap-2 px-4 py-2.5 text-gray-700 text-sm outline-none transition-colors hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-primary-200"
            onClick={onClose}
            to="/dashboard/upload-product"
          >
            <Upload aria-hidden="true" size={18} />
            Tải lên sản phẩm
          </Link>
          <Link
            className="flex cursor-pointer items-center gap-2 px-4 py-2.5 text-gray-700 text-sm outline-none transition-colors hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-primary-200"
            onClick={onClose}
            to="/dashboard/product"
          >
            <Package aria-hidden="true" size={18} />
            Sản phẩm
          </Link>
        </nav>
      ) : (
        <nav aria-label="Tài khoản" className="py-1">
          <Link
            className="flex cursor-pointer items-center gap-2 px-4 py-2.5 text-gray-700 text-sm outline-none transition-colors hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-primary-200"
            onClick={onClose}
            to="/dashboard/profile"
          >
            <User aria-hidden="true" size={18} />
            Hồ sơ của tôi
          </Link>
          <Link
            className="flex cursor-pointer items-center gap-2 px-4 py-2.5 text-gray-700 text-sm outline-none transition-colors hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-primary-200"
            onClick={onClose}
            to="/dashboard/myorders"
          >
            <Package aria-hidden="true" size={18} />
            Đơn hàng của tôi
          </Link>
          <Link
            className="flex cursor-pointer items-center gap-2 px-4 py-2.5 text-gray-700 text-sm outline-none transition-colors hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-primary-200"
            onClick={onClose}
            to="/dashboard/address"
          >
            <MapPin aria-hidden="true" size={18} />
            Địa chỉ đã lưu
          </Link>
        </nav>
      )}

      <Divider />

      <button
        className="flex w-full cursor-pointer items-center gap-2 px-4 py-2.5 font-medium text-red-600 text-sm outline-none transition-colors hover:bg-red-50 focus-visible:ring-2 focus-visible:ring-red-300"
        onClick={onLogout}
        type="button"
      >
        <LogOut aria-hidden="true" size={18} />
        Đăng xuất
      </button>
    </div>
  );
};

export default UserMenu;
