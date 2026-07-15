import { MapPin } from "lucide-react";

const Addresses = () => {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-md sm:p-8">
      <h1 className="font-bold text-secondary-100 text-xl">Địa chỉ đã lưu</h1>
      <div className="mt-10 flex flex-col items-center justify-center gap-3 py-10 text-center">
        <MapPin aria-hidden="true" className="text-gray-300" size={48} />
        <p className="font-medium text-gray-600">Chưa có địa chỉ nào</p>
        <p className="text-gray-400 text-sm">
          Thêm địa chỉ giao hàng để thanh toán nhanh hơn.
        </p>
      </div>
    </div>
  );
};

export default Addresses;
