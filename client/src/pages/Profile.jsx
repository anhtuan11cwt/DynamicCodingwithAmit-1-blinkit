import { Camera, Loader2, Save } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import SummaryApi from "../common/SummaryApi";
import UserProfileAvatarEdit from "../components/UserProfileAvatarEdit";
import { setUserDetails } from "../store/userSlice";
import AxiosToastError from "../utils/AxiosToastError";
import Axios from "../utils/axios";
import fetchUserDetails from "../utils/fetchUserDetails";
import {
  mobileSchema,
  profileUpdateSchema,
} from "../validations/profile.validation";

const initialData = { email: "", mobile: "", name: "" };

const wrapClass = (hasError, disabled) =>
  `flex items-center rounded-lg border bg-gray-50 px-3 transition-colors focus-within:bg-white ${
    hasError
      ? "border-red-400 focus-within:border-red-500"
      : "border-gray-300 focus-within:border-primary-200"
  } ${disabled ? "pointer-events-none opacity-50" : ""}`;

const Profile = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [data, setData] = useState(initialData);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);

  useEffect(() => {
    if (user._id) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setData({
        email: user.email || "",
        mobile: user.mobile || "",
        name: user.name || "",
      });
    }
  }, [user._id, user.email, user.mobile, user.name]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const sanitized = name === "mobile" ? value.replace(/\D/g, "") : value;
    setData((prev) => ({ ...prev, [name]: sanitized }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateField = (name, value) => {
    const schemaMap = {
      email: profileUpdateSchema.shape.email,
      mobile: mobileSchema,
      name: profileUpdateSchema.shape.name,
    };
    const schema = schemaMap[name];
    if (!schema) return;
    const result = schema.safeParse(value);
    setErrors((prev) => ({
      ...prev,
      [name]: result.success ? undefined : result.error.issues[0]?.message,
    }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    validateField(name, value);
  };

  const isFormFilled = data.name.trim() !== "" && data.email.trim() !== "";

  const fieldOrder = ["name", "email", "mobile"];

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = profileUpdateSchema.safeParse({
      email: data.email,
      mobile: data.mobile.trim() === "" ? undefined : data.mobile,
      name: data.name,
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

    const payload = { email: result.data.email, name: result.data.name };
    if (data.mobile.trim() !== "") {
      payload.mobile = result.data.mobile;
    }

    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.updateUserDetails,
        data: payload,
      });

      if (response.data.success) {
        toast.success(response.data.message);
        const updated = await fetchUserDetails();
        if (updated?.data) {
          dispatch(setUserDetails(updated.data));
        }
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  const displayName = user.name || "Người dùng";
  const initial = (user.name || user.email || "U").charAt(0).toUpperCase();

  return (
    <div className="rounded-2xl bg-white p-6 shadow-md sm:p-8">
      <h1 className="font-bold text-secondary-100 text-xl">Hồ sơ của tôi</h1>

      <div className="mt-6 flex items-center gap-4">
        <div className="relative">
          {user.avatar ? (
            <img
              alt={displayName}
              className="size-20 rounded-full object-cover"
              src={user.avatar}
            />
          ) : (
            <span className="flex size-20 items-center justify-center rounded-full bg-primary-100 font-semibold text-3xl text-primary-200">
              {initial}
            </span>
          )}
          <button
            aria-label="Cập nhật ảnh đại diện"
            className="absolute -right-1 -bottom-1 flex cursor-pointer items-center justify-center rounded-full bg-green-600 p-2 text-white shadow outline-none transition-colors hover:bg-green-700 focus-visible:ring-2 focus-visible:ring-green-800 focus-visible:ring-offset-2"
            onClick={() => setAvatarOpen(true)}
            type="button"
          >
            <Camera aria-hidden="true" size={16} />
          </button>
        </div>
        <div>
          <p className="font-semibold text-gray-800">{displayName}</p>
          <p className="text-gray-500 text-sm">{user.email}</p>
        </div>
      </div>

      <form className="mt-6 grid gap-4" noValidate onSubmit={handleSubmit}>
        <div className="grid gap-1.5">
          <label className="font-medium text-gray-700 text-sm" htmlFor="name">
            Họ và tên <span className="text-red-500">*</span>
          </label>
          <div className={wrapClass(Boolean(errors.name), loading)}>
            <input
              aria-describedby={errors.name ? "name-error" : undefined}
              aria-invalid={Boolean(errors.name)}
              autoComplete="name"
              className="h-11 w-full bg-transparent text-gray-800 text-sm outline-none placeholder:text-gray-400"
              disabled={loading}
              id="name"
              name="name"
              onBlur={handleBlur}
              onChange={handleChange}
              placeholder="Nguyễn Văn A"
              required
              type="text"
              value={data.name}
            />
          </div>
          {errors.name && (
            <p className="text-red-500 text-xs" id="name-error" role="alert">
              {errors.name}
            </p>
          )}
        </div>

        <div className="grid gap-1.5">
          <label className="font-medium text-gray-700 text-sm" htmlFor="email">
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
          <label className="font-medium text-gray-700 text-sm" htmlFor="mobile">
            Số điện thoại
          </label>
          <div className={wrapClass(Boolean(errors.mobile), loading)}>
            <input
              aria-describedby={errors.mobile ? "mobile-error" : undefined}
              aria-invalid={Boolean(errors.mobile)}
              autoComplete="tel"
              className="h-11 w-full bg-transparent text-gray-800 text-sm outline-none placeholder:text-gray-400"
              disabled={loading}
              id="mobile"
              inputMode="tel"
              maxLength={10}
              name="mobile"
              onBlur={handleBlur}
              onChange={handleChange}
              placeholder="0912345678"
              type="tel"
              value={data.mobile}
            />
          </div>
          {errors.mobile && (
            <p className="text-red-500 text-xs" id="mobile-error" role="alert">
              {errors.mobile}
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
            <Save aria-hidden="true" size={18} />
          )}
          {loading ? "Đang lưu..." : "Lưu thay đổi"}
        </button>
      </form>

      <UserProfileAvatarEdit
        onClose={() => setAvatarOpen(false)}
        open={avatarOpen}
      />
    </div>
  );
};

export default Profile;
