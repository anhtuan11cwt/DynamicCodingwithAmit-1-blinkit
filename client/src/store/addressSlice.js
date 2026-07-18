import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  addressList: [],
};

const addressSlice = createSlice({
  initialState,
  name: "address",
  reducers: {
    handleAddress: (state, action) => {
      state.addressList = action.payload;
    },
  },
});

export const { handleAddress } = addressSlice.actions;

export default addressSlice.reducer;
