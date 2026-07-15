import { Eye, EyeOff, KeyRound, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import SummaryApi from "../common/SummaryApi";
import AxiosToastError from "../utils/AxiosToastError";
import Axios from "../utils/axios";
import {
  fieldSchemas,
  resetPasswordSchema,
} from "../validations/auth.validation";

const fieldOrder = ["newPassword", "confirmPassword"];

const initialData = {
  confirmPassword: "",
  newPassword: "",
};

const wrapClass = (hasError, disabled) =>
  `flex items-center rounded-lg border bg-gray-50 px-3 transition-colors focus-within:bg-white ${
    hasError
      ? "border-red-400 focus-within:border-red-500"
      : "border-gray-300 focus-within:border-primary-200"
  } ${disabled ? "pointer-events-none opacity-50" : ""}`;

const ResetPassword = () => {
  const [data, setData] = useState(initialData);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;
  const otp = location.state?.otp;

  useEffect(() => {
    if (!email || !otp) {
      navigate("/forgot-password", { replace: true });
    }
  }, [email, otp, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateField = (name, value) => {
    const result = fieldSchemas[name].safeParse(value);
    let message;
    if (!result.success) {
      message = result.error.issues[0]?.message;
    } else if (name === "confirmPassword" && value !== data.newPassword) {
      message = "Mật khẩu xác nhận không khớp";
    }
    setErrors((prev) => ({ ...prev, [name]: message }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    validateField(name, value);
  };

  const isFormFilled = Object.values(data).every(
    (value) => value.trim() !== "",
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = resetPasswordSchema.safeParse({
      ...data,
      email,
    });
    if (!result.success) {
      const fieldErrors = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0];
        if (key && !fieldErrors[key]) {
          fieldErrors[key] = issue.message;
        }
      }
      setErrors(fieldErrors);
      const firstInvalid = fieldOrder.find((key) => fieldErrors[key]);
      if (firstInvalid) {
        document.getElementById(firstInvalid)?.focus();
      }
      return;
    }

    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.resetPassword,
        data: {
          email,
          newPassword: result.data.newPassword,
          otp,
        },
      });

      if (response.data.success) {
        toast.success(response.data.message);
        setData(initialData);
        setErrors({});
        navigate("/login");
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  if (!email || !otp) return null;

  return (
    <section className="flex min-h-[78vh] items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-md sm:p-8">
        <div className="mb-6 text-center">
          <h1 className="font-bold text-2xl text-secondary-100">
            Đặt lại mật khẩu
          </h1>
          <p className="mt-1 text-gray-500 text-sm">
            Nhập mật khẩu mới cho{" "}
            <span className="font-medium text-gray-700">{email}</span>
          </p>
        </div>

        <form className="grid gap-4" noValidate onSubmit={handleSubmit}>
          <div className="grid gap-1.5">
            <label
              className="font-medium text-gray-700 text-sm"
              htmlFor="newPassword"
            >
              Mật khẩu mới <span className="text-red-500">*</span>
            </label>
            <div className={wrapClass(Boolean(errors.newPassword), loading)}>
              <input
                aria-describedby={
                  errors.newPassword ? "newPassword-error" : "newPassword-hint"
                }
                aria-invalid={Boolean(errors.newPassword)}
                autoComplete="new-password"
                className="h-11 w-full bg-transparent text-gray-800 text-sm outline-none placeholder:text-gray-400"
                disabled={loading}
                id="newPassword"
                name="newPassword"
                onBlur={handleBlur}
                onChange={handleChange}
                placeholder="Nhập mật khẩu mới"
                required
                type={showPassword ? "text" : "password"}
                value={data.newPassword}
              />
              <button
                aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                className={`flex shrink-0 items-center justify-center p-1 text-gray-400 outline-none transition-colors hover:text-primary-200 focus-visible:text-primary-200 ${
                  loading
                    ? "pointer-events-none cursor-not-allowed opacity-50"
                    : "cursor-pointer"
                }`}
                disabled={loading}
                onClick={() => setShowPassword((prev) => !prev)}
                type="button"
              >
                {showPassword ? (
                  <EyeOff aria-hidden="true" size={20} />
                ) : (
                  <Eye aria-hidden="true" size={20} />
                )}
              </button>
            </div>
            {errors.newPassword ? (
              <p
                className="text-red-500 text-xs"
                id="newPassword-error"
                role="alert"
              >
                {errors.newPassword}
              </p>
            ) : (
              <p className="text-gray-400 text-xs" id="newPassword-hint">
                Tối thiểu 8 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc
                biệt.
              </p>
            )}
          </div>

          <div className="grid gap-1.5">
            <label
              className="font-medium text-gray-700 text-sm"
              htmlFor="confirmPassword"
            >
              Xác nhận mật khẩu <span className="text-red-500">*</span>
            </label>
            <div
              className={wrapClass(Boolean(errors.confirmPassword), loading)}
            >
              <input
                aria-describedby={
                  errors.confirmPassword ? "confirmPassword-error" : undefined
                }
                aria-invalid={Boolean(errors.confirmPassword)}
                autoComplete="new-password"
                className="h-11 w-full bg-transparent text-gray-800 text-sm outline-none placeholder:text-gray-400"
                disabled={loading}
                id="confirmPassword"
                name="confirmPassword"
                onBlur={handleBlur}
                onChange={handleChange}
                placeholder="Nhập lại mật khẩu"
                required
                type={showPassword ? "text" : "password"}
                value={data.confirmPassword}
              />
              <button
                aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                className={`flex shrink-0 items-center justify-center p-1 text-gray-400 outline-none transition-colors hover:text-primary-200 focus-visible:text-primary-200 ${
                  loading
                    ? "pointer-events-none cursor-not-allowed opacity-50"
                    : "cursor-pointer"
                }`}
                disabled={loading}
                onClick={() => setShowPassword((prev) => !prev)}
                type="button"
              >
                {showPassword ? (
                  <EyeOff aria-hidden="true" size={20} />
                ) : (
                  <Eye aria-hidden="true" size={20} />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p
                className="text-red-500 text-xs"
                id="confirmPassword-error"
                role="alert"
              >
                {errors.confirmPassword}
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
              <KeyRound aria-hidden="true" size={18} />
            )}
            {loading ? "Đang đặt lại..." : "Đặt lại mật khẩu"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default ResetPassword;
