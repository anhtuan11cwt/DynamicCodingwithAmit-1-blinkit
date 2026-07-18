import { CheckCircle2, Home, Loader2, Package } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import SummaryApi from "../common/SummaryApi";
import { GlobalContext } from "../provider/useGlobalContext";
import Axios from "../utils/axios";

const Success = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const { fetchCartItem } = useContext(GlobalContext);
  const [processing, setProcessing] = useState(!!sessionId);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!sessionId) return;

    const createOrder = async () => {
      try {
        const response = await Axios({
          ...SummaryApi.paymentSuccess,
          data: { sessionId },
        });

        if (response.data.success) {
          await fetchCartItem();
        }
      } catch (err) {
        setError(err.response?.data?.message || "Đã xảy ra lỗi");
      } finally {
        setProcessing(false);
      }
    };

    createOrder();
  }, [sessionId, fetchCartItem]);

  if (processing) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
        <Loader2 className="animate-spin text-green-600" size={64} />
        <h1 className="font-bold text-2xl text-secondary-100">
          Đang xử lý đơn hàng...
        </h1>
        <p className="text-gray-500 text-sm">Vui lòng đợi trong giây lát.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
        <h1 className="font-bold text-2xl text-red-600">Đã xảy ra lỗi</h1>
        <p className="text-gray-500 text-sm">{error}</p>
        <Link
          className="mt-4 flex items-center justify-center gap-2 rounded-full bg-green-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-green-700 focus-visible:ring-2 focus-visible:ring-green-800"
          to="/"
        >
          <Home aria-hidden="true" size={18} />
          Về trang chủ
        </Link>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
      <CheckCircle2 aria-hidden="true" className="text-green-600" size={64} />
      <h1 className="font-bold text-2xl text-secondary-100">
        Đặt hàng thành công
      </h1>
      <p className="text-gray-500 text-sm">
        Cảm ơn bạn đã mua hàng tại Blinkit. Đơn hàng của bạn đang được xử lý.
      </p>
      <div className="mt-4 flex gap-3">
        <Link
          className="flex items-center justify-center gap-2 rounded-full bg-green-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-green-700 focus-visible:ring-2 focus-visible:ring-green-800"
          to="/dashboard/myorders"
        >
          <Package aria-hidden="true" size={18} />
          Xem đơn hàng
        </Link>
        <Link
          className="flex items-center justify-center gap-2 rounded-full border-2 border-green-600 px-6 py-3 font-semibold text-green-600 transition-colors hover:bg-green-50 focus-visible:ring-2 focus-visible:ring-green-800"
          to="/"
        >
          <Home aria-hidden="true" size={18} />
          Về trang chủ
        </Link>
      </div>
    </div>
  );
};

export default Success;
