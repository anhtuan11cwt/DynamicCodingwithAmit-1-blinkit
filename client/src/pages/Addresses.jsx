import { Edit2, Plus, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import SummaryApi from "../common/SummaryApi";
import AddAddress from "../components/AddAddress";
import { handleAddress } from "../store/addressSlice";
import AxiosToastError from "../utils/AxiosToastError";
import Axios from "../utils/axios";

const Addresses = () => {
  const [openAddress, setOpenAddress] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const addressList = useSelector((state) => state.address.addressList);
  const dispatch = useDispatch();

  const fetchAddress = useCallback(async () => {
    try {
      const response = await Axios({ ...SummaryApi.getAddress });
      if (response.data.success) {
        dispatch(handleAddress(response.data.data));
      }
    } catch (error) {
      AxiosToastError(error);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchAddress();
  }, [fetchAddress]);

  const handleEdit = (address) => {
    setEditData(address);
    setOpenAddress(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa địa chỉ này?")) return;

    setDeleting(true);
    try {
      const response = await Axios({
        ...SummaryApi.deleteAddress,
        params: { id },
      });
      if (response.data.success) {
        toast.success(response.data.message);
        fetchAddress();
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="rounded-2xl bg-white p-6 shadow-md sm:p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-bold text-secondary-100 text-xl">Địa chỉ đã lưu</h1>
        <button
          aria-label="Thêm địa chỉ mới"
          className="flex cursor-pointer items-center gap-2 rounded-full bg-green-600 px-5 py-2.5 font-semibold text-white transition-colors hover:bg-green-700 focus-visible:ring-2 focus-visible:ring-green-800"
          onClick={() => {
            setEditData(null);
            setOpenAddress(true);
          }}
          type="button"
        >
          <Plus aria-hidden="true" size={18} />
          Thêm địa chỉ
        </button>
      </div>

      {deleting && addressList.length === 0 ? (
        <div className="flex items-center justify-center py-20">
          <p className="text-gray-500">Đang xóa...</p>
        </div>
      ) : addressList.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
          <p className="font-medium text-gray-600">Chưa có địa chỉ nào</p>
          <p className="text-gray-400 text-sm">
            Thêm địa chỉ giao hàng để thanh toán nhanh hơn.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {addressList.map((address) => (
            <div
              className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
              key={address._id}
            >
              <div className="mb-3">
                <p className="font-medium text-secondary-100">
                  {address.address_line}
                </p>
                <p className="text-gray-500 text-sm">
                  {address.city}, {address.state}
                </p>
                {address.pincode && (
                  <p className="text-gray-500 text-sm">
                    Mã bưu điện: {address.pincode}
                  </p>
                )}
                {address.mobile && (
                  <p className="text-gray-500 text-sm">{address.mobile}</p>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  aria-label={`Chỉnh sửa địa chỉ ${address.address_line}`}
                  className="flex cursor-pointer items-center gap-1 rounded-lg border border-gray-300 px-3 py-2 font-medium text-secondary-100 text-sm transition-colors hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-green-600"
                  onClick={() => handleEdit(address)}
                  type="button"
                >
                  <Edit2 aria-hidden="true" size={16} />
                  Sửa
                </button>
                <button
                  aria-label={`Xóa địa chỉ ${address.address_line}`}
                  className="flex cursor-pointer items-center gap-1 rounded-lg border border-red-200 px-3 py-2 font-medium text-red-600 text-sm transition-colors hover:bg-red-50 focus-visible:ring-2 focus-visible:ring-red-500"
                  onClick={() => handleDelete(address._id)}
                  type="button"
                >
                  <Trash2 aria-hidden="true" size={16} />
                  Xóa
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {openAddress && (
        <AddAddress
          close={() => {
            setOpenAddress(false);
            setEditData(null);
          }}
          editData={editData}
        />
      )}
    </div>
  );
};

export default Addresses;
