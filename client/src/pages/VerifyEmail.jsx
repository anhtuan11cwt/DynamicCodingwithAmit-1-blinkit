import { CircleCheck, CircleX, Loader2, MailCheck } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { Link, useSearchParams } from "react-router-dom";
import SummaryApi from "../common/SummaryApi";
import Axios from "../utils/axios";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code");
  const [result, setResult] = useState(() => {
    if (!code) {
      const msg = "Liên kết xác thực không hợp lệ hoặc đã hết hạn.";
      toast.error(msg);
      return { message: msg, status: "error" };
    }
    return { message: "", status: "loading" };
  });
  const hasVerified = useRef(false);

  useEffect(() => {
    if (!code || hasVerified.current) return;
    hasVerified.current = true;

    const verify = async () => {
      try {
        const response = await Axios({
          ...SummaryApi.verifyEmail,
          data: { code },
        });

        if (response.data.success) {
          const msg = response.data.message || "Xác thực email thành công.";
          setResult({ message: msg, status: "success" });
          toast.success(msg);
        } else {
          const msg = response.data.message || "Xác thực email thất bại.";
          setResult({ message: msg, status: "error" });
          toast.error(msg);
        }
      } catch (error) {
        const msg =
          error?.response?.data?.message ||
          "Xác thực email thất bại. Vui lòng thử lại.";
        setResult({ message: msg, status: "error" });
        toast.error(msg);
      }
    };

    verify();
  }, [code]);

  return (
    <section className="flex min-h-[78vh] items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 text-center shadow-md sm:p-8">
        {result.status === "loading" && (
          <>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-50">
              <Loader2
                aria-hidden="true"
                className="animate-spin text-secondary-100"
                size={32}
              />
            </div>
            <h1 className="mt-5 font-bold text-secondary-100 text-xl">
              Đang xác thực email...
            </h1>
            <p className="mt-2 text-gray-500 text-sm">
              Vui lòng đợi trong giây lát.
            </p>
          </>
        )}

        {result.status === "success" && (
          <>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
              <CircleCheck
                aria-hidden="true"
                className="text-green-600"
                size={36}
              />
            </div>
            <h1 className="mt-5 font-bold text-secondary-100 text-xl">
              Xác thực thành công!
            </h1>
            <p className="mt-2 text-gray-500 text-sm">{result.message}</p>
            <Link
              className="mt-6 flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-green-600 font-semibold text-white outline-none transition-colors duration-200 hover:bg-green-700 focus-visible:ring-2 focus-visible:ring-green-800 focus-visible:ring-offset-2"
              to="/login"
            >
              <MailCheck aria-hidden="true" size={18} />
              Đăng nhập ngay
            </Link>
          </>
        )}

        {result.status === "error" && (
          <>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
              <CircleX aria-hidden="true" className="text-red-500" size={36} />
            </div>
            <h1 className="mt-5 font-bold text-secondary-100 text-xl">
              Xác thực thất bại
            </h1>
            <p className="mt-2 text-gray-500 text-sm">{result.message}</p>
            <div className="mt-6 grid gap-2">
              <Link
                className="flex h-11 w-full cursor-pointer items-center justify-center rounded-full bg-secondary-100 font-semibold text-white outline-none transition-colors duration-200 hover:bg-secondary-200 focus-visible:ring-2 focus-visible:ring-secondary-100 focus-visible:ring-offset-2"
                to="/register"
              >
                Đăng ký lại
              </Link>
              <Link
                className="flex h-11 w-full cursor-pointer items-center justify-center rounded-full border border-gray-300 font-semibold text-gray-700 outline-none transition-colors duration-200 hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-primary-200"
                to="/"
              >
                Về trang chủ
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default VerifyEmail;
