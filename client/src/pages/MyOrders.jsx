import { useSelector } from "react-redux";
import NoData from "../components/NoData";
import DisplayPriceInVND from "../utils/DisplayPriceInVND";

const STATUS_LABELS = {
  cancelled: "Đã hủy",
  delivered: "Đã giao hàng",
  processing: "Đang xử lý",
  shipped: "Đã giao cho vận chuyển",
};

const PAYMENT_LABELS = {
  cash_on_delivery: "COD",
  ONLINE: "Trực tuyến",
  paid: "Đã thanh toán",
};

const MyOrders = () => {
  const orderList = useSelector((state) => state.order.orderList);

  const groupedOrders = orderList.reduce((acc, order) => {
    if (!acc[order.orderId]) {
      acc[order.orderId] = {
        createdAt: order.createdAt,
        delivery_address: order.delivery_address,
        order_status: order.order_status,
        orderId: order.orderId,
        payment_method: order.payment_method,
        payment_status: order.payment_status,
        products: [],
        totalAmt: order.totalAmt,
      };
    }
    acc[order.orderId].products.push(order);
    return acc;
  }, {});

  const orders = Object.values(groupedOrders).sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  );

  if (orders.length === 0) {
    return (
      <div className="rounded-2xl bg-white p-6 shadow-md sm:p-8">
        <h1 className="font-bold text-secondary-100 text-xl">
          Đơn hàng của tôi
        </h1>
        <NoData message="Bạn chưa có đơn hàng nào. Hãy bắt đầu mua sắm ngay!" />
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white p-6 shadow-md sm:p-8">
      <h1 className="font-bold text-secondary-100 text-xl">Đơn hàng của tôi</h1>

      <div className="mt-6 flex flex-col gap-4">
        {orders.map((order) => (
          <div
            className="rounded-xl border border-gray-100 p-4"
            key={order.orderId}
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-gray-100 border-b pb-3">
              <div className="flex flex-col gap-1">
                <span className="font-medium text-secondary-100 text-sm">
                  Mã đơn: {order.orderId.slice(-8).toUpperCase()}
                </span>
                <span className="text-gray-400 text-xs">
                  {new Date(order.createdAt).toLocaleDateString("vi-VN", {
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div className="flex gap-2">
                <span
                  className={`rounded-full px-3 py-1 font-medium text-xs ${
                    order.payment_status === "paid" ||
                    order.payment_method === "ONLINE"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {PAYMENT_LABELS[order.payment_status] ||
                    PAYMENT_LABELS[order.payment_method] ||
                    order.payment_method}
                </span>
                <span className="rounded-full bg-blue-100 px-3 py-1 font-medium text-blue-700 text-xs">
                  {STATUS_LABELS[order.order_status] || order.order_status}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-3 pt-3">
              {order.products.map((item) => (
                <div className="flex gap-3" key={item._id}>
                  <img
                    alt={item.product_details?.name}
                    className="h-14 w-14 shrink-0 rounded-lg border border-gray-100 object-scale-down"
                    src={item.product_details?.image}
                  />
                  <div className="flex flex-1 flex-col justify-center gap-1">
                    <p className="line-clamp-1 font-medium text-secondary-100 text-sm">
                      {item.product_details?.name}
                    </p>
                    <p className="text-gray-500 text-xs">
                      {DisplayPriceInVND(item.subTotalAmt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-3 flex items-center justify-between border-gray-100 border-t pt-3">
              <span className="text-gray-500 text-sm">
                {order.products.length} sản phẩm
              </span>
              <span className="font-bold text-secondary-100 text-sm">
                Tổng: {DisplayPriceInVND(order.totalAmt)}
              </span>
            </div>

            {order.delivery_address && (
              <div className="mt-3 rounded-lg bg-gray-50 p-3">
                <p className="font-medium text-secondary-100 text-xs">
                  Địa chỉ giao hàng
                </p>
                <p className="mt-1 text-gray-500 text-xs">
                  {order.delivery_address.address_line},{" "}
                  {order.delivery_address.city}, {order.delivery_address.state}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyOrders;
