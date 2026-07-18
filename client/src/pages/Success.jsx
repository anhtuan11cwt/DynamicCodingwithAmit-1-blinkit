import { CheckCircle2, Home } from "lucide-react";
import { Link } from "react-router-dom";

const Success = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
      <CheckCircle2 aria-hidden="true" className="text-green-600" size={64} />
      <h1 className="font-bold text-2xl text-secondary-100">
        Đặt hàng thành công
      </h1>
      <p className="text-gray-500 text-sm">
        Cảm ơn bạn đã mua hàng tại Blinkit. Đơn hàng của bạn đang được xử lý.
      </p>
      <Link
        aria-label="Về trang chủ"
        className="mt-4 flex items-center justify-center gap-2 rounded-full bg-green-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-green-700 focus-visible:ring-2 focus-visible:ring-green-800"
        to="/"
      >
        <Home aria-hidden="true" size={18} />
        Về trang chủ
      </Link>
    </div>
  );
};

export default Success;
