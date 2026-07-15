import { Loader2, ShieldCheck } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import SummaryApi from "../common/SummaryApi";
import AxiosToastError from "../utils/AxiosToastError";
import Axios from "../utils/axios";

const OTP_LENGTH = 6;

const OTPVerification = () => {
  const [otp, setOtp] = useState(new Array(OTP_LENGTH).fill(""));
  const [loading, setLoading] = useState(false);
  const inputRef = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      navigate("/forgot-password", { replace: true });
    }
  }, [email, navigate]);

  useEffect(() => {
    inputRef.current[0]?.focus();
  }, []);

  const handleChange = (e, index) => {
    const { value } = e.target;
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < OTP_LENGTH - 1) {
      inputRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRef.current[index - 1]?.focus();
    }
    if (e.key === "ArrowLeft" && index > 0) {
      inputRef.current[index - 1]?.focus();
    }
    if (e.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      inputRef.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);
    if (!pasted) return;

    const newOtp = new Array(OTP_LENGTH).fill("");
    for (let i = 0; i < pasted.length; i++) {
      newOtp[i] = pasted[i];
    }
    setOtp(newOtp);
    const nextIndex = Math.min(pasted.length, OTP_LENGTH - 1);
    inputRef.current[nextIndex]?.focus();
  };

  const isComplete = otp.every((digit) => digit !== "");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const otpValue = otp.join("");
    if (otpValue.length !== OTP_LENGTH) {
      toast.error("Vui lòng nhập đủ 6 chữ số");
      return;
    }

    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.verifyForgotPasswordOtp,
        data: { email, otp: otpValue },
      });

      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/reset-password", {
          state: { email, otp: otpValue },
        });
      }
    } catch (error) {
      AxiosToastError(error);
      setOtp(new Array(OTP_LENGTH).fill(""));
      inputRef.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.forgotPassword,
        data: { email },
      });
      if (response.data.success) {
        toast.success(response.data.message);
        setOtp(new Array(OTP_LENGTH).fill(""));
        inputRef.current[0]?.focus();
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  if (!email) return null;

  return (
    <section className="flex min-h-[78vh] items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-md sm:p-8">
        <div className="mb-6 text-center">
          <h1 className="font-bold text-2xl text-secondary-100">
            Xác thực OTP
          </h1>
          <p className="mt-1 text-gray-500 text-sm">
            Nhập mã 6 chữ số đã gửi tới{" "}
            <span className="font-medium text-gray-700">{email}</span>
          </p>
        </div>

        <form className="grid gap-5" noValidate onSubmit={handleSubmit}>
          <div
            className={`flex justify-center gap-2 sm:gap-3 ${loading ? "pointer-events-none opacity-50" : ""}`}
          >
            {otp.map((digit, index) => (
              <input
                aria-label={`Chữ số OTP thứ ${index + 1}`}
                autoComplete={index === 0 ? "one-time-code" : "off"}
                className="h-12 w-12 rounded-lg border border-gray-300 bg-gray-50 text-center font-semibold text-gray-800 text-lg outline-none transition-colors focus:border-primary-200 focus:bg-white sm:h-14 sm:w-14"
                disabled={loading}
                inputMode="numeric"
                // biome-ignore lint/suspicious/noArrayIndexKey: các ô OTP cố định theo vị trí
                key={index}
                maxLength={1}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onPaste={handlePaste}
                ref={(el) => {
                  inputRef.current[index] = el;
                }}
                type="text"
                value={digit}
              />
            ))}
          </div>

          <button
            className={`mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-full bg-green-600 font-semibold text-white outline-none transition-colors duration-200 hover:bg-green-700 focus-visible:ring-2 focus-visible:ring-green-800 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500 ${
              loading ? "pointer-events-none opacity-50" : "cursor-pointer"
            }`}
            disabled={!isComplete || loading}
            type="submit"
          >
            {loading ? (
              <Loader2 aria-hidden="true" className="animate-spin" size={18} />
            ) : (
              <ShieldCheck aria-hidden="true" size={18} />
            )}
            {loading ? "Đang xác thực..." : "Xác thực"}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600 text-sm">
          Chưa nhận được mã?{" "}
          <button
            className={`font-semibold text-secondary-100 outline-none transition-colors hover:text-primary-200 focus-visible:text-primary-200 ${
              loading
                ? "pointer-events-none cursor-not-allowed opacity-50"
                : "cursor-pointer"
            }`}
            disabled={loading}
            onClick={handleResend}
            type="button"
          >
            Gửi lại
          </button>
        </p>
      </div>
    </section>
  );
};

export default OTPVerification;
