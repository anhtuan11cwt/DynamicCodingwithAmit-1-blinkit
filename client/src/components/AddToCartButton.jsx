import { Loader2, Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { useCallback, useContext, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import SummaryApi from "../common/SummaryApi";
import { GlobalContext } from "../provider/useGlobalContext";
import { handleAddItemCart } from "../store/cartProduct";
import AxiosToastError from "../utils/AxiosToastError";
import Axios from "../utils/axios";

const AddToCartButton = ({ product, showRemove = false, compact = false }) => {
  const { updateCartItemQuantity, deleteCartItem } = useContext(GlobalContext);

  const cartItem = useSelector((state) => state.cartItem.cart);
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const cartData = useMemo(() => {
    if (!product?._id) return null;
    return (
      cartItem.find((item) => item?.productId?._id === product._id) ?? null
    );
  }, [cartItem, product]);

  const isInCart = cartData !== null;
  const currentQty = cartData?.quantity ?? 0;
  const cartItemId = cartData?._id ?? null;
  const stock = Number(product?.stock ?? 0);
  const isOutOfStock = stock <= 0;

  const syncCart = useCallback(async () => {
    try {
      const response = await Axios({ ...SummaryApi.getCartItem });

      if (response.data.success) {
        dispatch(handleAddItemCart(response.data.data));
      }
    } catch (error) {
      AxiosToastError(error);
    }
  }, [dispatch]);

  const handleAdd = useCallback(
    async (e) => {
      e.preventDefault();
      e.stopPropagation();

      if (isOutOfStock || loading || !product?._id) return;

      setLoading(true);

      try {
        const response = await Axios({
          ...SummaryApi.addToCartItem,
          data: { productId: product._id },
        });

        if (response.data.success) {
          toast.success(response.data.message || "Đã thêm vào giỏ hàng");
          await syncCart();
        }
      } catch (error) {
        AxiosToastError(error);
      } finally {
        setLoading(false);
      }
    },
    [isOutOfStock, loading, product, syncCart],
  );

  const increaseQty = useCallback(
    async (e) => {
      e.preventDefault();
      e.stopPropagation();

      if (loading || !cartItemId || !currentQty) return;

      setLoading(true);

      try {
        await updateCartItemQuantity(cartItemId, currentQty + 1);
      } finally {
        setLoading(false);
      }
    },
    [cartItemId, currentQty, loading, updateCartItemQuantity],
  );

  const decreaseQty = useCallback(
    async (e) => {
      e.preventDefault();
      e.stopPropagation();

      if (loading || !cartItemId) return;

      setLoading(true);

      try {
        if (currentQty === 1) {
          await deleteCartItem(cartItemId);
        } else {
          await updateCartItemQuantity(cartItemId, currentQty - 1);
        }
      } finally {
        setLoading(false);
      }
    },
    [cartItemId, currentQty, deleteCartItem, loading, updateCartItemQuantity],
  );

  const handleRemove = useCallback(
    async (e) => {
      e.preventDefault();
      e.stopPropagation();

      if (loading || !cartItemId) return;

      setLoading(true);

      try {
        await deleteCartItem(cartItemId);
      } finally {
        setLoading(false);
      }
    },
    [cartItemId, deleteCartItem, loading],
  );

  if (!isInCart || isOutOfStock) {
    return (
      <button
        aria-label="Thêm vào giỏ hàng"
        className={`flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 px-6 py-3 font-semibold text-white outline-none transition-colors duration-200 hover:bg-green-700 focus-visible:ring-2 focus-visible:ring-green-800 focus-visible:ring-offset-2 active:scale-95 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500 ${
          loading ? "pointer-events-none opacity-50" : "cursor-pointer"
        }`}
        disabled={isOutOfStock || loading}
        onClick={handleAdd}
        type="button"
      >
        {loading ? (
          <Loader2 aria-hidden="true" className="animate-spin" size={18} />
        ) : (
          <ShoppingCart aria-hidden="true" size={18} />
        )}
        {isOutOfStock
          ? "Hết hàng"
          : loading
            ? "Đang thêm..."
            : compact
              ? "Thêm"
              : "Thêm vào giỏ hàng"}
      </button>
    );
  }

  const btnBase =
    "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border transition-colors focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50";

  return (
    <div className="flex w-full items-center justify-center gap-3">
      <button
        aria-label="Giảm số lượng"
        className={`${btnBase} border-gray-300 text-secondary-100 hover:bg-gray-100 focus-visible:ring-green-600 ${loading ? "pointer-events-none" : "cursor-pointer"}`}
        disabled={currentQty <= 1 || loading}
        onClick={decreaseQty}
        type="button"
      >
        <Minus aria-hidden="true" size={16} />
      </button>

      <span
        aria-atomic="true"
        aria-live="polite"
        className="min-w-8 text-center font-semibold text-secondary-100 tabular-nums"
      >
        {currentQty}
      </span>

      <button
        aria-label="Tăng số lượng"
        className={`${btnBase} border-gray-300 text-secondary-100 hover:bg-gray-100 focus-visible:ring-green-600 ${loading ? "pointer-events-none" : "cursor-pointer"}`}
        disabled={currentQty >= stock || loading}
        onClick={increaseQty}
        type="button"
      >
        <Plus aria-hidden="true" size={16} />
      </button>

      {showRemove && (
        <button
          aria-label="Xóa khỏi giỏ hàng"
          className={`${btnBase} border-red-200 text-red-600 hover:bg-red-50 focus-visible:ring-red-500 ${loading ? "pointer-events-none" : "cursor-pointer"}`}
          disabled={loading}
          onClick={handleRemove}
          type="button"
        >
          <Trash2 aria-hidden="true" size={16} />
        </button>
      )}
    </div>
  );
};

export default AddToCartButton;
