import toast from "react-hot-toast";

const AxiosToastError = (error) => {
  const message =
    error?.response?.data?.message || "Đã có lỗi xảy ra, vui lòng thử lại.";
  toast.error(message);
};

export default AxiosToastError;
