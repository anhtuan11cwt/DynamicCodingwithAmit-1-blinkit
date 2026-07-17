import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  allCategory: [],
  allProduct: [],
  allSubCategory: [],
  loadingCategory: false,
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
    setLoadingCategory: (state, action) => {
      state.loadingCategory = action.payload;
    },
  },
});

export const {
  setAllCategory,
  setAllProduct,
  setAllSubCategory,
  setLoadingCategory,
} = productSlice.actions;

export default productSlice.reducer;
