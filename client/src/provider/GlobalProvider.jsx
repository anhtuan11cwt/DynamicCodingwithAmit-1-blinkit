import { useCallback, useEffect, useMemo } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import SummaryApi from "../common/SummaryApi";
import { handleAddItemCart } from "../store/cartProduct";
import { setOrder } from "../store/orderSlice";
import AxiosToastError from "../utils/AxiosToastError";
import Axios from "../utils/axios";
import priceWithDiscount from "../utils/priceWithDiscount";
import { GlobalContext } from "./useGlobalContext";

export const GlobalProvider = ({ children }) => {
  const dispatch = useDispatch();
  const cartItem = useSelector((state) => state.cartItem.cart);
  const user = useSelector((state) => state.user);

  const fetchCartItem = useCallback(async () => {
    try {
      const response = await Axios({
        ...SummaryApi.getCartItem,
      });

      if (response.data.success) {
        dispatch(handleAddItemCart(response.data.data));
      }
    } catch (error) {
      AxiosToastError(error);
    }
  }, [dispatch]);

  const fetchOrders = useCallback(async () => {
    try {
      const response = await Axios({
        ...SummaryApi.getMyOrders,
      });

      if (response.data.success) {
        dispatch(setOrder(response.data.data));
      }
    } catch (error) {
      AxiosToastError(error);
    }
  }, [dispatch]);

  const updateCartItemQuantity = useCallback(
    async (cartItemId, quantity) => {
      try {
        const response = await Axios({
          ...SummaryApi.updateCartItem,
          data: {
            _id: cartItemId,
            quantity,
          },
        });

        if (response.data.success) {
          toast.success(response.data.message);
          fetchCartItem();
        }
      } catch (error) {
        AxiosToastError(error);
      }
    },
    [fetchCartItem],
  );

  const deleteCartItem = useCallback(
    async (cartItemId) => {
      try {
        const response = await Axios({
          ...SummaryApi.deleteCartItem,
          data: { _id: cartItemId },
        });

        if (response.data.success) {
          toast.success(response.data.message);
          fetchCartItem();
        }
      } catch (error) {
        AxiosToastError(error);
      }
    },
    [fetchCartItem],
  );

  useEffect(() => {
    if (user?._id) {
      fetchCartItem();
      fetchOrders();
    }
  }, [user, fetchCartItem, fetchOrders]);

  const { totalPrice, notDiscountTotalPrice, totalQuantity } = useMemo(() => {
    const totalQty = cartItem.reduce(
      (sum, item) => sum + (Number(item?.quantity) || 0),
      0,
    );

    const total = cartItem.reduce((sum, item) => {
      const product = item?.productId;

      if (!product) return sum;

      const discounted = priceWithDiscount(product.price, product.discount);

      return sum + discounted * (Number(item.quantity) || 0);
    }, 0);

    const original = cartItem.reduce((sum, item) => {
      const product = item?.productId;

      if (!product) return sum;

      return sum + Number(product.price) * (Number(item.quantity) || 0);
    }, 0);

    return {
      notDiscountTotalPrice: original,
      totalPrice: total,
      totalQuantity: totalQty,
    };
  }, [cartItem]);

  const value = {
    cartItem,
    deleteCartItem,
    fetchCartItem,
    fetchOrders,
    notDiscountTotalPrice,
    totalPrice,
    totalQuantity,
    updateCartItemQuantity,
  };

  return (
    <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>
  );
};

export default GlobalProvider;
