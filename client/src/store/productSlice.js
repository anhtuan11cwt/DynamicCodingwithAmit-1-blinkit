import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  allCategory: [],
  allProduct: [],
  allSubCategory: [],
};

const productSlice = createSlice({
  initialState,
  name: "product",
  reducers: {
    setAllCategory: (state, action) => {
      state.allCategory = action.payload || [];
    },
    setAllProduct: (state, action) => {
      state.allProduct = action.payload || [];
    },
    setAllSubCategory: (state, action) => {
      state.allSubCategory = action.payload || [];
    },
  },
});

export const { setAllCategory, setAllProduct, setAllSubCategory } =
  productSlice.actions;

export default productSlice.reducer;
