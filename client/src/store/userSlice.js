import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  _id: "",
  avatar: "",
  email: "",
  mobile: "",
  name: "",
  role: "",
  status: "",
  verify_email: false,
};

const userSlice = createSlice({
  initialState,
  name: "user",
  reducers: {
    logout: () => initialState,
    setUserDetails: (state, action) => {
      const payload = action.payload || {};
      state._id = payload._id || "";
      state.avatar = payload.avatar || "";
      state.email = payload.email || "";
      state.mobile = payload.mobile || "";
      state.name = payload.name || "";
      state.role = payload.role || "";
      state.status = payload.status || "";
      state.verify_email = payload.verify_email || false;
    },
    updateAvatar: (state, action) => {
      state.avatar = action.payload || "";
    },
  },
});

export const { logout, setUserDetails, updateAvatar } = userSlice.actions;

export default userSlice.reducer;
