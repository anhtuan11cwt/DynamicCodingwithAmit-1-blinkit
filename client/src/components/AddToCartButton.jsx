import { Minus, Plus, ShoppingCart } from "lucide-react";
import { useCallback, useContext, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import SummaryApi from "../common/SummaryApi";
import { GlobalContext } from "../provider/useGlobalContext";
import { handleAddItemCart } from "../store/cartProduct";
import AxiosToastError from "../utils/AxiosToastError";
import Axios from "../utils/axios";
import Loading from "./Loading";

const AddToCartButton = ({ product }) => {
  const { updateCartItemQuantity, deleteCartItem } = useContext(GlobalContext);

  const cartItem = useSelector((state) => state.cartItem.cart);
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);

  const found = cartItem.find((item) => {
    const pid = item?.productId?._id;
    return pid === product?._id;
  });

  const isInCart = found !== null;
  const currentQty = found?.quantity ?? 0;
  const cartItemId = found?._id ?? null;
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
        await syncCart();
      } finally {
        setLoading(false);
      }
    },
    [cartItemId, currentQty, loading, syncCart, updateCartItemQuantity],
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

        await syncCart();
      } finally {
        setLoading(false);
      }
    },
    [
      cartItemId,
      currentQty,
      deleteCartItem,
      loading,
      syncCart,
      updateCartItemQuantity,
    ],
  );

  if (loading) {
    return (
      <div className="flex w-full items-center justify-center">
        <Loading label="Đang xử lý..." />
      </div>
    );
  }

  if (!isInCart || isOutOfStock) {
    return (
      <button
        aria-label="Thêm vào giỏ hàng"
        className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-green-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-green-700 focus-visible:ring-2 focus-visible:ring-green-800 focus-visible:ring-offset-2 active:scale-95 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500"
        disabled={isOutOfStock}
        onClick={handleAdd}
        type="button"
      >
        <ShoppingCart aria-hidden="true" size={18} />
        {isOutOfStock ? "Hết hàng" : "Thêm vào giỏ hàng"}
      </button>
    );
  }

  return (
    <div className="flex w-full items-center justify-center gap-3">
      <button
        aria-label="Giảm số lượng"
        className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-gray-300 text-secondary-100 transition-colors hover:bg-gray-100 focus-visible:ring-2 focus-visible:ring-green-600 disabled:cursor-not-allowed disabled:opacity-50"
        disabled={currentQty <= 1}
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
        className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-gray-300 text-secondary-100 transition-colors hover:bg-gray-100 focus-visible:ring-2 focus-visible:ring-green-600 disabled:cursor-not-allowed disabled:opacity-50"
        disabled={currentQty >= stock}
        onClick={increaseQty}
        type="button"
      >
        <Plus aria-hidden="true" size={16} />
      </button>
    </div>
  );
};

export default AddToCartButton;
