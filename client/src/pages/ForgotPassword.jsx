import { Loader2, Mail } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import SummaryApi from "../common/SummaryApi";
import AxiosToastError from "../utils/AxiosToastError";
import Axios from "../utils/axios";
import { emailSchema } from "../validations/auth.validation";

const initialData = {
  email: "",
};

const wrapClass = (hasError, disabled) =>
  `flex items-center rounded-lg border bg-gray-50 px-3 transition-colors focus-within:bg-white ${
    hasError
      ? "border-red-400 focus-within:border-red-500"
      : "border-gray-300 focus-within:border-primary-200"
  } ${disabled ? "pointer-events-none opacity-50" : ""}`;

const ForgotPassword = () => {
  const [data, setData] = useState(initialData);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleBlur = (e) => {
    const { value } = e.target;
    const result = emailSchema.safeParse(value);
    setErrors((prev) => ({
      ...prev,
      email: result.success ? undefined : result.error.issues[0]?.message,
    }));
  };

  const isFormFilled = data.email.trim() !== "";

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = emailSchema.safeParse(data.email);
    if (!result.success) {
      const message = result.error.issues[0]?.message;
      setErrors({ email: message });
      document.getElementById("email")?.focus();
      return;
    }

    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.forgotPassword,
        data: { email: result.data },
      });

      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/verification-otp", { state: { email: result.data } });
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex min-h-[78vh] items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-md sm:p-8">
        <div className="mb-6 text-center">
          <h1 className="font-bold text-2xl text-secondary-100">
            Quên mật khẩu
          </h1>
          <p className="mt-1 text-gray-500 text-sm">
            Nhập email đã đăng ký để nhận mã OTP đặt lại mật khẩu.
          </p>
        </div>

        <form className="grid gap-4" noValidate onSubmit={handleSubmit}>
          <div className="grid gap-1.5">
            <label
              className="font-medium text-gray-700 text-sm"
              htmlFor="email"
            >
              Email <span className="text-red-500">*</span>
            </label>
            <div className={wrapClass(Boolean(errors.email), loading)}>
              <input
                aria-describedby={errors.email ? "email-error" : undefined}
                aria-invalid={Boolean(errors.email)}
                autoComplete="email"
                className="h-11 w-full bg-transparent text-gray-800 text-sm outline-none placeholder:text-gray-400"
                disabled={loading}
                id="email"
                inputMode="email"
                name="email"
                onBlur={handleBlur}
                onChange={handleChange}
                placeholder="email@example.com"
                required
                type="email"
                value={data.email}
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-xs" id="email-error" role="alert">
                {errors.email}
              </p>
            )}
          </div>

          <button
            className={`mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-full bg-green-600 font-semibold text-white outline-none transition-colors duration-200 hover:bg-green-700 focus-visible:ring-2 focus-visible:ring-green-800 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500 ${
              loading ? "pointer-events-none opacity-50" : "cursor-pointer"
            }`}
            disabled={!isFormFilled || loading}
            type="submit"
          >
            {loading ? (
              <Loader2 aria-hidden="true" className="animate-spin" size={18} />
            ) : (
              <Mail aria-hidden="true" size={18} />
            )}
            {loading ? "Đang gửi..." : "Gửi mã OTP"}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600 text-sm">
          Nhớ mật khẩu rồi?{" "}
          <Link
            className={`font-semibold text-secondary-100 outline-none transition-colors hover:text-primary-200 focus-visible:text-primary-200 ${
              loading ? "pointer-events-none cursor-not-allowed opacity-50" : ""
            }`}
            to="/login"
          >
            Đăng nhập
          </Link>
        </p>
      </div>
    </section>
  );
};

export default ForgotPassword;
