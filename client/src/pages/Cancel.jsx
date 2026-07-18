import { ArrowLeft, XCircle } from "lucide-react";
import { Link } from "react-router-dom";

const Cancel = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
      <XCircle aria-hidden="true" className="text-red-600" size={64} />
      <h1 className="font-bold text-2xl text-secondary-100">Đơn hàng đã hủy</h1>
      <p className="text-gray-500 text-sm">
        Đơn hàng của bạn đã bị hủy. Vui lòng thử lại hoặc liên hệ hỗ trợ nếu
        cần.
      </p>
      <Link
        aria-label="Thử lại"
        className="mt-4 flex items-center justify-center gap-2 rounded-full bg-green-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-green-700 focus-visible:ring-2 focus-visible:ring-green-800"
        to="/checkout"
      >
        <ArrowLeft aria-hidden="true" size={18} />
        Thử lại
      </Link>
    </div>
  );
};

export default Cancel;
