import { createSlice } from "@reduxjs/toolkit";

const orderSlice = createSlice({
  initialState: {
    orderList: [],
  },
  name: "order",
  reducers: {
    setOrder: (state, action) => {
      state.orderList = action.payload;
    },
  },
});

export const { setOrder } = orderSlice.actions;

export default orderSlice.reducer;
