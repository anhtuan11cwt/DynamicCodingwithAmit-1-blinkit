import {
  ArrowRight,
  Banknote,
  CreditCard,
  Plus,
  ShoppingBag,
  X,
} from "lucide-react";
import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { GlobalContext } from "../provider/useGlobalContext";
import DisplayPriceInVND from "../utils/DisplayPriceInVND";
import priceWithDiscount from "../utils/priceWithDiscount";

const CheckoutPage = () => {
  const cartItem = useSelector((state) => state.cartItem.cart);
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const { fetchCartItem } = useContext(GlobalContext);

  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(null);

  useEffect(() => {
    fetchCartItem();
  }, [fetchCartItem]);

  const totalQty = cartItem.reduce(
    (sum, item) => sum + (Number(item?.quantity) || 0),
    0,
  );

  const totalPrice = cartItem.reduce((sum, item) => {
    const product = item?.productId;
    if (!product) return sum;
    return (
      sum +
      priceWithDiscount(product.price, product.discount) *
        (Number(item.quantity) || 0)
    );
  }, 0);

  const handleCheckoutPage = () => {
    if (!user?._id) {
      toast.error("Please login first");
      return;
    }
    if (!selectedAddressId) {
      toast.error("Vui lòng chọn địa chỉ giao hàng");
      return;
    }
    if (!paymentMethod) {
      toast.error("Vui lòng chọn phương thức thanh toán");
      return;
    }
    toast.success("Chức năng thanh toán sẽ sớm được cập nhật");
  };

  return (
    <div className="flex min-h-screen flex-col">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between border-gray-100 border-b bg-white px-4 py-4 lg:px-6">
        <h1 className="font-semibold text-lg text-secondary-100">
          Thanh toán ({totalQty} sản phẩm)
        </h1>
        <button
          aria-label="Đóng thanh toán"
          className="flex cursor-pointer items-center justify-center rounded-lg p-2 text-secondary-100 outline-none transition-colors hover:bg-gray-100 focus-visible:ring-2 focus-visible:ring-green-600"
          onClick={() => navigate(-1)}
          type="button"
        >
          <X aria-hidden="true" size={20} />
        </button>
      </div>

      {cartItem.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center">
          <h3 className="font-semibold text-lg text-secondary-100">
            Giỏ hàng trống
          </h3>
          <p className="text-gray-500 text-sm">
            Vui lòng thêm sản phẩm vào giỏ hàng trước khi thanh toán.
          </p>
          <button
            className="flex items-center justify-center gap-2 rounded-full bg-green-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-green-700 focus-visible:ring-2 focus-visible:ring-green-800"
            onClick={() => navigate("/")}
            type="button"
          >
            <ShoppingBag aria-hidden="true" size={18} />
            Tiếp tục mua sắm
          </button>
        </div>
      ) : (
        <div className="mx-auto w-full max-w-7xl p-4 lg:p-6">
          <div className="flex flex-col gap-5 lg:flex-row">
            <div className="flex flex-1 flex-col gap-4">
              <div className="rounded-2xl bg-white p-5 shadow-sm">
                <h2 className="mb-4 font-semibold text-lg text-secondary-100">
                  Chọn địa chỉ giao hàng
                </h2>

                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-3">
                    <button
                      aria-label="Chọn địa chỉ mặc định"
                      className={`flex w-full cursor-pointer flex-col gap-1 rounded-xl border-2 p-4 text-left outline-none transition-all ${
                        selectedAddressId === "default"
                          ? "border-green-600 bg-green-50"
                          : "border-gray-200 hover:border-green-600"
                      } focus-visible:ring-2 focus-visible:ring-green-600`}
                      onClick={() => setSelectedAddressId("default")}
                      type="button"
                    >
                      <span className="font-medium text-secondary-100 text-sm">
                        123 Đường ABC, Phường XYZ
                      </span>
                      <span className="text-gray-500 text-xs">
                        Quận 1, TP. Hồ Chí Minh
                      </span>
                      <span className="text-gray-400 text-xs">0123456789</span>
                    </button>

                    <button
                      aria-label="Thêm địa chỉ mới"
                      className="flex h-16 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-gray-300 border-dashed text-gray-500 outline-none transition-colors hover:border-green-600 hover:text-green-600 focus-visible:ring-2 focus-visible:ring-green-600"
                      type="button"
                    >
                      <Plus aria-hidden="true" size={18} />
                      <span className="font-medium text-sm">
                        Thêm địa chỉ mới
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full lg:w-[400px]">
              <div className="rounded-2xl bg-blue-50 p-5">
                <h2 className="mb-4 font-semibold text-lg text-secondary-100">
                  Tóm tắt đơn hàng
                </h2>

                <div className="flex flex-col gap-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Tổng sản phẩm</span>
                    <span className="font-medium text-secondary-100">
                      {totalQty} sản phẩm
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Tổng tiền</span>
                    <span className="font-medium text-secondary-100">
                      {DisplayPriceInVND(totalPrice)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Phí vận chuyển</span>
                    <span className="font-semibold text-green-700">
                      MIỄN PHÍ
                    </span>
                  </div>
                  <div className="flex justify-between border-gray-200 border-t pt-3 font-bold text-base">
                    <span className="text-secondary-100">Tổng thanh toán</span>
                    <span className="text-secondary-100">
                      {DisplayPriceInVND(totalPrice)}
                    </span>
                  </div>
                </div>

                <div className="mt-5 flex flex-col gap-3">
                  <button
                    aria-label="Thanh toán trực tuyến"
                    className={`flex min-h-[44px] w-full cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-green-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-green-700 focus-visible:ring-2 focus-visible:ring-green-800 ${
                      paymentMethod === "online" ? "ring-2 ring-green-800" : ""
                    }`}
                    onClick={() => setPaymentMethod("online")}
                    type="button"
                  >
                    <CreditCard aria-hidden="true" size={18} />
                    Thanh toán trực tuyến
                  </button>
                  <button
                    aria-label="Thanh toán khi nhận hàng"
                    className={`flex min-h-[44px] w-full cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-lg border-2 border-green-600 px-4 py-3 font-semibold text-green-600 transition-colors hover:bg-green-600 hover:text-white focus-visible:ring-2 focus-visible:ring-green-800 ${
                      paymentMethod === "cod" ? "bg-green-600 text-white" : ""
                    }`}
                    onClick={() => setPaymentMethod("cod")}
                    type="button"
                  >
                    <Banknote aria-hidden="true" size={18} />
                    Thanh toán khi nhận hàng
                  </button>
                </div>

                <button
                  className="mt-4 flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-green-600 py-3 font-semibold text-white transition-colors hover:bg-green-700 focus-visible:ring-2 focus-visible:ring-green-800"
                  onClick={handleCheckoutPage}
                  type="button"
                >
                  Xác nhận đơn hàng
                  <ArrowRight aria-hidden="true" size={18} />
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <h2 className="mb-4 font-semibold text-lg text-secondary-100">
              Đơn hàng của bạn
            </h2>
            <div className="flex max-h-[300px] flex-col gap-3 overflow-y-auto">
              {cartItem.map((item) => {
                const product = item?.productId;
                if (!product) return null;
                const discountedPrice = priceWithDiscount(
                  product.price,
                  product.discount,
                );
                const hasDiscount = Number(product.discount) > 0;

                return (
                  <div
                    className="flex gap-3 border-gray-100 border-b pb-3 last:border-b-0"
                    key={item._id}
                  >
                    <img
                      alt={product.name}
                      className="h-16 w-16 shrink-0 rounded-lg border border-gray-100 object-scale-down"
                      src={product.image?.[0]}
                    />
                    <div className="flex flex-1 flex-col gap-1">
                      <p className="line-clamp-2 font-medium text-secondary-100 text-sm leading-5">
                        {product.name}
                      </p>
                      <p className="text-gray-500 text-xs">{product.unit}</p>
                      <div className="flex items-baseline gap-1.5">
                        <p className="font-semibold text-sm">
                          {DisplayPriceInVND(discountedPrice)}
                        </p>
                        {hasDiscount && (
                          <p className="text-gray-400 text-xs line-through">
                            {DisplayPriceInVND(product.price)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
