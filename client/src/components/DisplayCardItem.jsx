import { X } from "lucide-react";
import { useContext, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import emptyCart from "../assets/empty_cart.webp";
import { GlobalContext } from "../provider/useGlobalContext";
import DisplayPriceInVND from "../utils/DisplayPriceInVND";
import priceWithDiscount from "../utils/priceWithDiscount";
import AddToCartButton from "./AddToCartButton";

const DisplayCardItem = ({ onClose }) => {
  const cartItem = useSelector((state) => state.cartItem.cart);
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

  return (
    <div
      aria-label="Giỏ hàng"
      aria-modal="true"
      className="fixed inset-0 z-50"
      role="dialog"
    >
      <div
        aria-hidden="true"
        className="fixed inset-0 bg-neutral-800/70"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 ml-auto flex min-h-screen w-full max-w-sm flex-col overflow-y-auto bg-white shadow-2xl">
        <div className="flex items-center justify-between border-gray-100 border-b px-4 py-4">
          <h2 className="font-semibold text-lg text-secondary-100">
            Giỏ hàng ({totalQty} sản phẩm)
          </h2>
          <button
            aria-label="Đóng giỏ hàng"
            className="flex cursor-pointer items-center justify-center rounded-lg p-2 text-secondary-100 outline-none transition-colors hover:bg-gray-100 focus-visible:ring-2 focus-visible:ring-green-600"
            onClick={onClose}
            type="button"
          >
            <X aria-hidden="true" size={20} />
          </button>
        </div>

        {cartItem.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center">
            <img
              alt="Giỏ hàng trống"
              className="h-48 w-48 object-contain"
              src={emptyCart}
            />
            <h3 className="font-semibold text-lg text-secondary-100">
              Chưa có sản phẩm
            </h3>
            <p className="text-gray-500 text-sm">
              Bạn chưa thêm sản phẩm nào vào giỏ hàng.
            </p>
            <Link
              className="rounded-full bg-green-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-green-700 focus-visible:ring-2 focus-visible:ring-green-800"
              onClick={onClose}
              to="/"
            >
              Bắt đầu mua sắm
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-4 overflow-y-auto p-4">
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
                      <AddToCartButton product={product} showRemove />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="sticky bottom-0 space-y-2 border-gray-100 border-t bg-white p-4">
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
              <div className="flex justify-between border-gray-100 border-t pt-2 font-bold text-base">
                <span className="text-secondary-100">Tổng thanh toán</span>
                <span className="text-secondary-100">
                  {DisplayPriceInVND(totalPrice)}
                </span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DisplayCardItem;
