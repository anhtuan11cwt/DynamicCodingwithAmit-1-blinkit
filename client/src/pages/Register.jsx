import { Eye, EyeOff, Loader2, UserPlus } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import SummaryApi from "../common/SummaryApi";
import AxiosToastError from "../utils/AxiosToastError";
import Axios from "../utils/axios";
import { fieldSchemas, registerSchema } from "../validations/auth.validation";

const fields = [
  {
    autoComplete: "name",
    label: "Họ và tên",
    name: "name",
    placeholder: "Nguyễn Văn A",
    type: "text",
  },
  {
    autoComplete: "email",
    inputMode: "email",
    label: "Email",
    name: "email",
    placeholder: "email@example.com",
    type: "email",
  },
];

const fieldOrder = ["name", "email", "password", "confirmPassword"];

const initialData = {
  confirmPassword: "",
  email: "",
  name: "",
  password: "",
};

const wrapClass = (hasError, disabled) =>
  `flex items-center rounded-lg border bg-gray-50 px-3 transition-colors focus-within:bg-white ${
    hasError
      ? "border-red-400 focus-within:border-red-500"
      : "border-gray-300 focus-within:border-primary-200"
  } ${disabled ? "pointer-events-none opacity-50" : ""}`;

const Register = () => {
  const [data, setData] = useState(initialData);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
    } else if (name === "confirmPassword" && value !== data.password) {
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

    const result = registerSchema.safeParse(data);
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
        ...SummaryApi.register,
        data: {
          email: result.data.email,
          name: result.data.name,
          password: result.data.password,
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

  return (
    <section className="flex min-h-[78vh] items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-md sm:p-8">
        <div className="mb-6 text-center">
          <h1 className="font-bold text-2xl text-secondary-100">
            Tạo tài khoản
          </h1>
          <p className="mt-1 text-gray-500 text-sm">
            Chào mừng bạn đến với Blinkit
          </p>
        </div>

        <form className="grid gap-4" noValidate onSubmit={handleSubmit}>
          {fields.map((field) => (
            <div className="grid gap-1.5" key={field.name}>
              <label
                className="font-medium text-gray-700 text-sm"
                htmlFor={field.name}
              >
                {field.label} <span className="text-red-500">*</span>
              </label>
              <div className={wrapClass(Boolean(errors[field.name]), loading)}>
                <input
                  aria-describedby={
                    errors[field.name] ? `${field.name}-error` : undefined
                  }
                  aria-invalid={Boolean(errors[field.name])}
                  autoComplete={field.autoComplete}
                  className="h-11 w-full bg-transparent text-gray-800 text-sm outline-none placeholder:text-gray-400"
                  disabled={loading}
                  id={field.name}
                  inputMode={field.inputMode}
                  name={field.name}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  required
                  type={field.type}
                  value={data[field.name]}
                />
              </div>
              {errors[field.name] && (
                <p
                  className="text-red-500 text-xs"
                  id={`${field.name}-error`}
                  role="alert"
                >
                  {errors[field.name]}
                </p>
              )}
            </div>
          ))}

          <div className="grid gap-1.5">
            <label
              className="font-medium text-gray-700 text-sm"
              htmlFor="password"
            >
              Mật khẩu <span className="text-red-500">*</span>
            </label>
            <div className={wrapClass(Boolean(errors.password), loading)}>
              <input
                aria-describedby={
                  errors.password ? "password-error" : "password-hint"
                }
                aria-invalid={Boolean(errors.password)}
                autoComplete="new-password"
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
            {errors.password ? (
              <p
                className="text-red-500 text-xs"
                id="password-error"
                role="alert"
              >
                {errors.password}
              </p>
            ) : (
              <p className="text-gray-400 text-xs" id="password-hint">
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
              <UserPlus aria-hidden="true" size={18} />
            )}
            {loading ? "Đang đăng ký..." : "Đăng ký"}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600 text-sm">
          Đã có tài khoản?{" "}
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

export default Register;
