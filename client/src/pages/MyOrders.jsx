import { Package } from "lucide-react";

const MyOrders = () => {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-md sm:p-8">
      <h1 className="font-bold text-secondary-100 text-xl">Đơn hàng của tôi</h1>
      <div className="mt-10 flex flex-col items-center justify-center gap-3 py-10 text-center">
        <Package aria-hidden="true" className="text-gray-300" size={48} />
        <p className="font-medium text-gray-600">Chưa có đơn hàng nào</p>
        <p className="text-gray-400 text-sm">
          Các đơn hàng của bạn sẽ hiển thị tại đây.
        </p>
      </div>
    </div>
  );
};

export default MyOrders;
