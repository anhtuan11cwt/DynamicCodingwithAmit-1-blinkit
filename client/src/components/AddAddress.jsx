import { Check, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import SummaryApi from "../common/SummaryApi";
import { handleAddress } from "../store/addressSlice";
import AxiosToastError from "../utils/AxiosToastError";
import Axios from "../utils/axios";

const wrapClass = (hasError) =>
  `rounded-lg border bg-gray-50 px-4 py-3 outline-none transition-colors focus:bg-white ${
    hasError
      ? "border-red-400 focus:border-red-500"
      : "border-gray-300 focus:border-green-600 focus:ring-2 focus:ring-green-600"
  }`;

const AddAddress = ({ close, editData }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: editData || {
      address_line: "",
      city: "",
      mobile: "",
      pincode: "",
      state: "",
    },
  });

  const onlyDigits = (e, max) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    e.target.value = value.slice(0, max);
  };

  const mobileStartsWithZero = (e) => {
    let value = e.target.value.replace(/[^0-9]/g, "").slice(0, 10);
    if (value.length > 0 && !value.startsWith("0")) {
      value = `0${value}`;
      value = value.slice(0, 10);
    }
    e.target.value = value;
  };

  const onSubmit = async (data) => {
    setLoading(true);
    setServerError("");
    try {
      if (editData?._id) {
        const response = await Axios({
          ...SummaryApi.updateAddress,
          data,
          params: { id: editData._id },
        });
        if (response.data.success) {
          toast.success(response.data.message || "Địa chỉ đã được cập nhật");
          await fetchAddress();
          reset();
          close();
        }
      } else {
        const response = await Axios({ ...SummaryApi.addAddress, data });
        if (response.data.success) {
          toast.success(response.data.message || "Địa chỉ đã được thêm");
          await fetchAddress();
          reset();
          close();
        }
      }
    } catch (error) {
      const msg =
        error.response?.data?.message || "Đã xảy ra lỗi, vui lòng thử lại";
      setServerError(msg);
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAddress = async () => {
    try {
      const response = await Axios({ ...SummaryApi.getAddress });
      if (response.data.success) {
        dispatch(handleAddress(response.data.data));
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  return (
    <section className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70">
      <div className="my-10 w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-semibold text-lg text-secondary-100">
            {editData?._id ? "Chỉnh sửa địa chỉ" : "Thêm địa chỉ mới"}
          </h2>
          <button
            aria-label="Đóng modal địa chỉ"
            className="flex cursor-pointer items-center justify-center rounded-lg p-2 text-secondary-100 outline-none transition-colors hover:bg-gray-100 focus-visible:ring-2 focus-visible:ring-green-600"
            onClick={close}
            type="button"
          >
            <X aria-hidden="true" size={20} />
          </button>
        </div>

        {serverError && (
          <p className="mb-4 text-red-500 text-xs" role="alert">
            {serverError}
          </p>
        )}

        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-1.5">
            <label
              className="font-medium text-gray-700 text-sm"
              htmlFor="address_line"
            >
              Địa chỉ <span className="text-red-500">*</span>
            </label>
            <input
              {...register("address_line", { required: "Địa chỉ là bắt buộc" })}
              aria-describedby={
                errors.address_line ? "address_line-error" : undefined
              }
              aria-invalid={Boolean(errors.address_line)}
              className={wrapClass(Boolean(errors.address_line))}
              id="address_line"
              placeholder="Nhập địa chỉ"
            />
            {errors.address_line && (
              <p
                className="text-red-500 text-xs"
                id="address_line-error"
                role="alert"
              >
                {errors.address_line.message}
              </p>
            )}
          </div>

          <div className="grid gap-1.5">
            <label className="font-medium text-gray-700 text-sm" htmlFor="city">
              Thành phố <span className="text-red-500">*</span>
            </label>
            <input
              {...register("city", { required: "Thành phố là bắt buộc" })}
              aria-describedby={errors.city ? "city-error" : undefined}
              aria-invalid={Boolean(errors.city)}
              className={wrapClass(Boolean(errors.city))}
              id="city"
              placeholder="Nhập thành phố"
            />
            {errors.city && (
              <p className="text-red-500 text-xs" id="city-error" role="alert">
                {errors.city.message}
              </p>
            )}
          </div>

          <div className="grid gap-1.5">
            <label
              className="font-medium text-gray-700 text-sm"
              htmlFor="state"
            >
              Tỉnh/Thành <span className="text-red-500">*</span>
            </label>
            <input
              {...register("state", { required: "Tỉnh/Thành là bắt buộc" })}
              aria-describedby={errors.state ? "state-error" : undefined}
              aria-invalid={Boolean(errors.state)}
              className={wrapClass(Boolean(errors.state))}
              id="state"
              placeholder="Nhập tỉnh/thành"
            />
            {errors.state && (
              <p className="text-red-500 text-xs" id="state-error" role="alert">
                {errors.state.message}
              </p>
            )}
          </div>

          <div className="grid gap-1.5">
            <label
              className="font-medium text-gray-700 text-sm"
              htmlFor="pincode"
            >
              Mã bưu điện
            </label>
            <input
              {...register("pincode", {
                pattern: {
                  message: "Mã bưu điện phải có 5-6 chữ số",
                  value: /^\d{5,6}$/,
                },
              })}
              aria-describedby={errors.pincode ? "pincode-error" : undefined}
              aria-invalid={Boolean(errors.pincode)}
              className={wrapClass(Boolean(errors.pincode))}
              id="pincode"
              inputMode="numeric"
              maxLength={6}
              onInput={(e) => onlyDigits(e, 6)}
              placeholder="Nhập mã bưu điện"
            />
            {errors.pincode && (
              <p
                className="text-red-500 text-xs"
                id="pincode-error"
                role="alert"
              >
                {errors.pincode.message}
              </p>
            )}
          </div>

          <div className="grid gap-1.5">
            <label
              className="font-medium text-gray-700 text-sm"
              htmlFor="mobile"
            >
              Số điện thoại
            </label>
            <input
              {...register("mobile", {
                pattern: {
                  message: "Số điện thoại phải có 10 chữ số và bắt đầu bằng 0",
                  value: /^0\d{9}$/,
                },
              })}
              aria-describedby={errors.mobile ? "mobile-error" : undefined}
              aria-invalid={Boolean(errors.mobile)}
              className={wrapClass(Boolean(errors.mobile))}
              id="mobile"
              inputMode="numeric"
              maxLength={10}
              onInput={(e) => mobileStartsWithZero(e)}
              placeholder="Nhập số điện thoại"
            />
            {errors.mobile && (
              <p
                className="text-red-500 text-xs"
                id="mobile-error"
                role="alert"
              >
                {errors.mobile.message}
              </p>
            )}
          </div>

          <button
            className="mt-2 flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-green-600 py-3 font-semibold text-white transition-colors hover:bg-green-700 focus-visible:ring-2 focus-visible:ring-green-800 disabled:cursor-not-allowed disabled:bg-gray-300"
            disabled={loading}
            type="submit"
          >
            {loading ? (
              "Đang lưu..."
            ) : editData?._id ? (
              <>
                <Check aria-hidden="true" size={18} />
                Cập nhật
              </>
            ) : (
              <>
                <Check aria-hidden="true" size={18} />
                Lưu địa chỉ
              </>
            )}
          </button>
        </form>
      </div>
    </section>
  );
};

export default AddAddress;
