import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cart: [],
};

const cartProductSlice = createSlice({
  initialState,
  name: "cartProduct",
  reducers: {
    handleAddItemCart: (state, action) => {
      state.cart = action.payload;
    },
  },
});

export const { handleAddItemCart } = cartProductSlice.actions;

export default cartProductSlice.reducer;
