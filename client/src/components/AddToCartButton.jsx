import { Minus, Plus, ShoppingCart } from "lucide-react";

const AddToCartButton = ({ onAdd, stock = 0 }) => {
  return (
    <button
      aria-label="Thêm vào giỏ hàng"
      className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-green-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-green-700 focus-visible:ring-2 focus-visible:ring-green-800 focus-visible:ring-offset-2 active:scale-95 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500"
      disabled={stock <= 0}
      onClick={onAdd}
      type="button"
    >
      <ShoppingCart aria-hidden="true" size={18} />
      Thêm vào giỏ hàng
    </button>
  );
};

export const QuantityStepper = ({ onChange, quantity, stock = 0 }) => {
  const decrement = () => {
    if (quantity > 1) {
      onChange(quantity - 1);
    }
  };

  const increment = () => {
    if (quantity < stock) {
      onChange(quantity + 1);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <button
        aria-label="Giảm số lượng"
        className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-gray-300 text-secondary-100 transition-colors hover:bg-gray-100 focus-visible:ring-2 focus-visible:ring-green-600 disabled:cursor-not-allowed disabled:opacity-50"
        disabled={quantity <= 1}
        onClick={decrement}
        type="button"
      >
        <Minus aria-hidden="true" size={16} />
      </button>

      <span
        aria-live="polite"
        className="min-w-8 text-center font-semibold text-secondary-100 tabular-nums"
      >
        {quantity}
      </span>

      <button
        aria-label="Tăng số lượng"
        className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-gray-300 text-secondary-100 transition-colors hover:bg-gray-100 focus-visible:ring-2 focus-visible:ring-green-600 disabled:cursor-not-allowed disabled:opacity-50"
        disabled={quantity >= stock}
        onClick={increment}
        type="button"
      >
        <Plus aria-hidden="true" size={16} />
      </button>
    </div>
  );
};

export default AddToCartButton;
