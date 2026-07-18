import { ArrowRight, ShoppingBag, X } from "lucide-react";
import { useContext, useEffect } from "react";
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

  useEffect(() => {
    fetchCartItem();
  }, [fetchCartItem]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

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

  const originalTotal = cartItem.reduce((sum, item) => {
    const product = item?.productId;
    if (!product) return sum;
    return sum + Number(product.price) * (Number(item.quantity) || 0);
  }, 0);

  const totalSavings = originalTotal - totalPrice;

  const handleCheckoutPage = () => {
    if (!user?._id) {
      toast.error("Please login first");
      return;
    }
    toast.success("Chức năng thanh toán sẽ sớm được cập nhật");
  };

  return (
    <div className="flex flex-col">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between border-gray-100 border-b bg-white px-4 py-4 lg:px-6">
        <h1 className="font-semibold text-lg text-secondary-100">
          Checkout ({totalQty} sản phẩm)
        </h1>
        <button
          aria-label="Đóng checkout"
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
        <>
          <div className="mx-auto w-full max-w-7xl space-y-4 overflow-y-auto p-4 lg:p-6">
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
                  className="flex gap-3 border-gray-100 border-b pb-4"
                  key={item._id}
                >
                  <img
                    alt={product.name}
                    className="h-20 w-20 shrink-0 rounded-lg border border-gray-100 object-scale-down"
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

          <div className="mx-auto w-full max-w-7xl space-y-3 border-gray-100 border-t bg-white p-5 lg:p-8">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Tiết kiệm của bạn</span>
              <span className="font-semibold text-green-700">
                {DisplayPriceInVND(totalSavings)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Tổng cộng</span>
              <span className="font-semibold">
                {DisplayPriceInVND(totalPrice)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Vận chuyển</span>
              <span className="font-semibold text-green-700">MIỄN PHÍ</span>
            </div>
            <div className="flex justify-between border-gray-100 border-t pt-3 font-bold text-base">
              <span className="text-secondary-100">Tổng thanh toán</span>
              <span className="text-secondary-100">
                {DisplayPriceInVND(totalPrice)}
              </span>
            </div>
            <button
              className="mt-3 flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-green-600 py-3 font-semibold text-white transition-colors hover:bg-green-700 focus-visible:ring-2 focus-visible:ring-green-800"
              onClick={handleCheckoutPage}
              type="button"
            >
              Xác nhận đơn hàng
              <ArrowRight aria-hidden="true" size={18} />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CheckoutPage;
