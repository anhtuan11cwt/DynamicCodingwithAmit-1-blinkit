import { ShieldAlert } from "lucide-react";
import { useSelector } from "react-redux";
import isAdmin from "../utils/isAdmin";

const AdminPermission = ({ children }) => {
  const user = useSelector((state) => state.user);

  if (!isAdmin(user.role)) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-center">
        <ShieldAlert aria-hidden="true" className="text-red-500" size={40} />
        <p className="rounded-lg bg-red-50 px-4 py-2 font-semibold text-red-600">
          Bạn không có quyền truy cập trang này
        </p>
      </div>
    );
  }

  return children;
};

export default AdminPermission;
