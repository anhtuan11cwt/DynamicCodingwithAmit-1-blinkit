import { Eye, EyeOff, Loader2, LogIn } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import SummaryApi from "../common/SummaryApi";
import { setUserDetails } from "../store/userSlice";
import AxiosToastError from "../utils/AxiosToastError";
import Axios from "../utils/axios";
import fetchUserDetails from "../utils/fetchUserDetails";
import { fieldSchemas, loginSchema } from "../validations/auth.validation";

const fieldOrder = ["email", "password"];

const initialData = {
  email: "",
  password: "",
};

const wrapClass = (hasError, disabled) =>
  `flex items-center rounded-lg border bg-gray-50 px-3 transition-colors focus-within:bg-white ${
    hasError
      ? "border-red-400 focus-within:border-red-500"
      : "border-gray-300 focus-within:border-primary-200"
  } ${disabled ? "pointer-events-none opacity-50" : ""}`;

const Login = () => {
  const [data, setData] = useState(initialData);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
    setErrors((prev) => ({
      ...prev,
      [name]: result.success ? undefined : result.error.issues[0]?.message,
    }));
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

    const result = loginSchema.safeParse(data);
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
        ...SummaryApi.login,
        data: {
          email: result.data.email,
          password: result.data.password,
        },
      });

      if (response.data.success) {
        toast.success(response.data.message);

        const userDetails = await fetchUserDetails();
        if (userDetails?.data) {
          dispatch(setUserDetails(userDetails.data));
        }

        setData(initialData);
        setErrors({});
        navigate("/");
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
          <h1 className="font-bold text-2xl text-secondary-100">Đăng nhập</h1>
          <p className="mt-1 text-gray-500 text-sm">
            Chào mừng bạn quay lại Blinkit
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

          <div className="grid gap-1.5">
            <div className="flex items-center justify-between">
              <label
                className="font-medium text-gray-700 text-sm"
                htmlFor="password"
              >
                Mật khẩu <span className="text-red-500">*</span>
              </label>
              <Link
                className={`font-medium text-secondary-100 text-xs outline-none transition-colors hover:text-primary-200 focus-visible:text-primary-200 ${
                  loading
                    ? "pointer-events-none cursor-not-allowed opacity-50"
                    : ""
                }`}
                to="/forgot-password"
              >
                Quên mật khẩu?
              </Link>
            </div>
            <div className={wrapClass(Boolean(errors.password), loading)}>
              <input
                aria-describedby={
                  errors.password ? "password-error" : undefined
                }
                aria-invalid={Boolean(errors.password)}
                autoComplete="current-password"
                className="h-11 w-full bg-transparent text-gray-800 text-sm outline-none placeholder:text-gray-400"
                disabled={loading}
                id="password"
                name="password"
                onBlur={handleBlur}
                onChange={handleChange}
                placeholder="Nhập mật khẩu"
                required
                type={showPassword ? "text" : "password"}
                value={data.password}
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
            {errors.password && (
              <p
                className="text-red-500 text-xs"
                id="password-error"
                role="alert"
              >
                {errors.password}
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
              <LogIn aria-hidden="true" size={18} />
            )}
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600 text-sm">
          Chưa có tài khoản?{" "}
          <Link
            className={`font-semibold text-secondary-100 outline-none transition-colors hover:text-primary-200 focus-visible:text-primary-200 ${
              loading ? "pointer-events-none cursor-not-allowed opacity-50" : ""
            }`}
            to="/register"
          >
            Đăng ký
          </Link>
        </p>
      </div>
    </section>
  );
};

export default Login;
