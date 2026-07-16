import {
  LayoutGrid,
  ListTree,
  LogOut,
  MapPin,
  Package,
  Upload,
  User,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import isAdmin from "../utils/isAdmin";
import Divider from "./Divider";

const UserMenuMobile = ({ onClose, onLogout, user }) => {
  const displayName = user.name || "Người dùng";
  const initial = (user.name || user.email || "U").charAt(0).toUpperCase();

  return (
    <div
      aria-label="Menu tài khoản"
      className="fixed inset-0 z-[60] flex flex-col bg-white lg:hidden"
      role="dialog"
    >
      <div className="flex items-center justify-between border-gray-100 border-b px-4 py-3">
        <p className="font-bold text-lg text-secondary-100">Tài khoản</p>
        <button
          aria-label="Đóng menu"
          className="flex cursor-pointer items-center justify-center rounded-lg p-2 text-secondary-100 outline-none transition-colors hover:bg-gray-100 focus-visible:ring-2 focus-visible:ring-primary-200"
          onClick={onClose}
          type="button"
        >
          <X aria-hidden="true" size={24} />
        </button>
      </div>

      <div className="flex items-center gap-3 px-4 py-5">
        {user.avatar ? (
          <img
            alt={displayName}
            className="size-14 shrink-0 rounded-full object-cover"
            src={user.avatar}
          />
        ) : (
          <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-primary-100 font-semibold text-primary-200 text-xl">
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
        <nav aria-label="Quản trị" className="flex-1 px-2 py-2">
          <Link
            className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-3.5 text-base text-gray-700 outline-none transition-colors hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-primary-200"
            onClick={onClose}
            to="/dashboard/category"
          >
            <LayoutGrid aria-hidden="true" size={20} />
            Danh mục
          </Link>
          <Link
            className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-3.5 text-base text-gray-700 outline-none transition-colors hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-primary-200"
            onClick={onClose}
            to="/dashboard/subcategory"
          >
            <ListTree aria-hidden="true" size={20} />
            Danh mục con
          </Link>
          <Link
            className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-3.5 text-base text-gray-700 outline-none transition-colors hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-primary-200"
            onClick={onClose}
            to="/dashboard/upload-product"
          >
            <Upload aria-hidden="true" size={20} />
            Tải lên sản phẩm
          </Link>
          <Link
            className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-3.5 text-base text-gray-700 outline-none transition-colors hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-primary-200"
            onClick={onClose}
            to="/dashboard/product"
          >
            <Package aria-hidden="true" size={20} />
            Sản phẩm
          </Link>
        </nav>
      ) : (
        <nav aria-label="Tài khoản" className="flex-1 px-2 py-2">
          <Link
            className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-3.5 text-base text-gray-700 outline-none transition-colors hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-primary-200"
            onClick={onClose}
            to="/dashboard/profile"
          >
            <User aria-hidden="true" size={20} />
            Hồ sơ của tôi
          </Link>
          <Link
            className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-3.5 text-base text-gray-700 outline-none transition-colors hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-primary-200"
            onClick={onClose}
            to="/dashboard/myorders"
          >
            <Package aria-hidden="true" size={20} />
            Đơn hàng của tôi
          </Link>
          <Link
            className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-3.5 text-base text-gray-700 outline-none transition-colors hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-primary-200"
            onClick={onClose}
            to="/dashboard/address"
          >
            <MapPin aria-hidden="true" size={20} />
            Địa chỉ đã lưu
          </Link>
        </nav>
      )}

      <Divider />

      <button
        className="m-3 flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-red-50 px-4 py-3 font-medium text-red-600 outline-none transition-colors hover:bg-red-100 focus-visible:ring-2 focus-visible:ring-red-300"
        onClick={onLogout}
        type="button"
      >
        <LogOut aria-hidden="true" size={20} />
        Đăng xuất
      </button>
    </div>
  );
};

export default UserMenuMobile;
