import {
  ArrowRight,
  Banknote,
  CreditCard,
  Loader2,
  Plus,
  ShoppingBag,
  X,
} from "lucide-react";
import { useCallback, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import SummaryApi from "../common/SummaryApi";
import AddAddress from "../components/AddAddress";
import { GlobalContext } from "../provider/useGlobalContext";
import { handleAddress } from "../store/addressSlice";
import AxiosToastError from "../utils/AxiosToastError";
import Axios from "../utils/axios";
import DisplayPriceInVND from "../utils/DisplayPriceInVND";
import priceWithDiscount from "../utils/priceWithDiscount";

const CheckoutPage = () => {
  const cartItem = useSelector((state) => state.cartItem.cart);
  const user = useSelector((state) => state.user);
  const addressList = useSelector((state) => state.address.addressList);
  const navigate = useNavigate();
  const { fetchCartItem, fetchOrders } = useContext(GlobalContext);
  const dispatch = useDispatch();

  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [openAddress, setOpenAddress] = useState(false);
  const [codLoading, setCodLoading] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState("");

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
    fetchCartItem();
  }, [fetchCartItem]);

  useEffect(() => {
    fetchAddress();
  }, [fetchAddress]);

  useEffect(() => {
    if (paymentUrl) {
      window.location.href = paymentUrl;
    }
  }, [paymentUrl]);

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

  const handleCashOnDelivery = async () => {
    if (!user?._id) {
      toast.error("Vui lòng đăng nhập");
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

    setCodLoading(true);
    try {
      if (paymentMethod === "cod") {
        const list_items = cartItem
          .map((item) => {
            const product = item?.productId;
            if (!product) return null;
            return {
              _id: item._id,
              image: product.image || [],
              name: product.name,
              productId: product._id,
              quantity: Number(item.quantity) || 1,
            };
          })
          .filter(Boolean);

        const response = await Axios({
          ...SummaryApi.cashOnDelivery,
          data: {
            addressId: selectedAddressId,
            list_items,
            subTotalAmt: totalPrice,
            totalAmt: totalPrice,
          },
        });

        if (response.data.success) {
          toast.success(response.data.message || "Đặt hàng thành công");
          await fetchCartItem();
          await fetchOrders();
          navigate("/success");
        }
      } else if (paymentMethod === "online") {
        const loadingToast = toast.loading(
          "Đang chuyển đến trang thanh toán...",
        );

        try {
          const response = await Axios({
            ...SummaryApi.paymentCheckout,
            data: { addressId: selectedAddressId },
          });

          if (response.data.success && response.data.url) {
            setPaymentUrl(response.data.url);
          }
        } catch (stripeError) {
          toast.error(
            stripeError.message || "Đã có lỗi xảy ra, vui lòng thử lại.",
          );
        } finally {
          toast.dismiss(loadingToast);
        }
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setCodLoading(false);
    }
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
        <div
          className={`mx-auto w-full max-w-7xl p-4 lg:p-6 ${
            codLoading ? "pointer-events-none opacity-50" : ""
          }`}
        >
          <div className="flex flex-col gap-5 lg:flex-row">
            <div className="flex flex-1 flex-col gap-4">
              <div className="rounded-2xl bg-white p-5 shadow-sm">
                <h2 className="mb-4 font-semibold text-lg text-secondary-100">
                  Chọn địa chỉ giao hàng
                </h2>

                <div className="flex flex-col gap-3">
                  {addressList.length === 0 ? (
                    <p className="text-center text-gray-500 text-sm">
                      Bạn chưa có địa chỉ nào
                    </p>
                  ) : (
                    addressList.map((address) => (
                      <button
                        aria-label={`Chọn địa chỉ ${address.address_line}`}
                        className={`flex w-full cursor-pointer flex-col gap-1 rounded-xl border-2 p-4 text-left outline-none transition-all ${
                          selectedAddressId === address._id
                            ? "border-green-600 bg-green-50"
                            : "border-gray-200 hover:border-green-600"
                        } focus-visible:ring-2 focus-visible:ring-green-600`}
                        key={address._id}
                        onClick={() => setSelectedAddressId(address._id)}
                        type="button"
                      >
                        <span className="font-medium text-secondary-100 text-sm">
                          {address.address_line}
                        </span>
                        <span className="text-gray-500 text-xs">
                          {address.city}, {address.state}
                        </span>
                        {address.pincode && (
                          <span className="text-gray-400 text-xs">
                            Mã bưu điện: {address.pincode}
                          </span>
                        )}
                        {address.mobile && (
                          <span className="text-gray-400 text-xs">
                            {address.mobile}
                          </span>
                        )}
                      </button>
                    ))
                  )}

                  <button
                    aria-label="Thêm địa chỉ mới"
                    className="flex h-16 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-gray-300 border-dashed text-gray-500 outline-none transition-colors hover:border-green-600 hover:text-green-600 focus-visible:ring-2 focus-visible:ring-green-600"
                    onClick={() => setOpenAddress(true)}
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
                    className={`flex min-h-[44px] w-full cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-lg px-4 py-3 font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-green-800 ${
                      paymentMethod === "online"
                        ? "bg-green-600 text-white ring-2 ring-green-800 hover:bg-green-700"
                        : "border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
                    }`}
                    onClick={() => setPaymentMethod("online")}
                    type="button"
                  >
                    <CreditCard aria-hidden="true" size={18} />
                    Thanh toán trực tuyến
                  </button>
                  <button
                    aria-label="Thanh toán khi nhận hàng"
                    className={`flex min-h-[44px] w-full cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-lg px-4 py-3 font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-green-800 ${
                      paymentMethod === "cod"
                        ? "bg-green-600 text-white ring-2 ring-green-800 hover:bg-green-700"
                        : "border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
                    }`}
                    onClick={() => setPaymentMethod("cod")}
                    type="button"
                  >
                    <Banknote aria-hidden="true" size={18} />
                    Thanh toán khi nhận hàng
                  </button>
                </div>

                <button
                  className="mt-4 flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-green-600 py-3 font-semibold text-white transition-colors hover:bg-green-700 focus-visible:ring-2 focus-visible:ring-green-800 disabled:cursor-not-allowed disabled:bg-gray-300"
                  disabled={codLoading}
                  onClick={handleCashOnDelivery}
                  type="button"
                >
                  {codLoading ? (
                    <>
                      <Loader2
                        aria-hidden="true"
                        className="animate-spin"
                        size={18}
                      />
                      Đang xử lý...
                    </>
                  ) : (
                    <>
                      Xác nhận đơn hàng
                      <ArrowRight aria-hidden="true" size={18} />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-2xl bg-white p-5 shadow-sm">
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

      {openAddress && (
        <AddAddress
          close={() => {
            setOpenAddress(false);
            fetchAddress();
          }}
        />
      )}
    </div>
  );
};

export default CheckoutPage;
