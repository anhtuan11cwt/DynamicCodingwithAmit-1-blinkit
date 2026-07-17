import { ShoppingCart } from "lucide-react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import priceWithDiscount from "../utils/priceWithDiscount";

const CardMobileLink = () => {
  const cartItem = useSelector((state) => state.cartItem.cart);

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

  if (cartItem.length === 0) return null;

  return (
    <Link
      aria-label={`Xem giỏ hàng, ${totalQty} sản phẩm, ${totalPrice.toLocaleString("vi-VN")} ₫`}
      className="fixed right-0 bottom-0 left-0 z-50 flex items-center justify-between bg-green-600 px-4 py-3 text-white lg:hidden"
      to="/cart"
    >
      <div className="flex items-center gap-3">
        <div className="relative">
          <ShoppingCart aria-hidden="true" size={24} />
          <span
            aria-hidden="true"
            className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-green-700 font-bold text-xs"
          >
            {totalQty}
          </span>
        </div>
        <span className="font-semibold">{totalQty} Sản phẩm</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="font-bold">
          {totalPrice.toLocaleString("vi-VN")} ₫
        </span>
        <span className="font-medium text-sm">Xem giỏ hàng →</span>
      </div>
    </Link>
  );
};

export default CardMobileLink;
