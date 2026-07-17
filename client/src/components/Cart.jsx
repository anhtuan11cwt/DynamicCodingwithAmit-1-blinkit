import { ShoppingCart } from "lucide-react";

const Cart = ({ onClick, totalPrice = 0, totalQty = 0 }) => {
  return (
    <button
      aria-label={`Giỏ hàng, ${totalQty} sản phẩm, tổng ${totalPrice.toLocaleString("vi-VN")} ₫`}
      className="relative flex cursor-pointer items-center gap-3 rounded-lg bg-green-600 px-4 py-2 text-white shadow-sm outline-none transition-all duration-300 hover:bg-green-700 focus-visible:ring-2 focus-visible:ring-green-800"
      onClick={onClick}
      type="button"
    >
      <ShoppingCart
        aria-hidden="true"
        className="shrink-0 motion-reduce:animate-none"
        size={20}
      />
      <span className="flex flex-col text-left leading-tight">
        <span className="font-medium text-sm">{totalQty} sản phẩm</span>
        <span className="font-bold">
          {totalPrice.toLocaleString("vi-VN")} ₫
        </span>
      </span>
      {totalQty > 0 && (
        <span
          aria-hidden="true"
          className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-green-700 font-bold text-xs"
        >
          {totalQty}
        </span>
      )}
    </button>
  );
};

export default Cart;
