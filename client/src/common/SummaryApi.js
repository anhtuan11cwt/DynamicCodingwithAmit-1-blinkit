const SummaryApi = {
  addCategory: {
    method: "post",
    url: "/category/add-category",
  },
  addSubCategory: {
    method: "post",
    url: "/subcategory/add",
  },
  createProduct: {
    method: "post",
    url: "/product/create",
  },
  deleteCategory: {
    method: "delete",
    url: "/category/delete",
  },
  deleteProduct: {
    method: "delete",
    url: "/product/delete",
  },
  deleteSubCategory: {
    method: "delete",
    url: "/subcategory/delete",
  },
  forgotPassword: {
    method: "post",
    url: "/auth/forgot-password",
  },
  getCategory: {
    method: "get",
    url: "/category/get",
  },
  getProduct: {
    method: "post",
    url: "/product/get",
  },
  getProductById: {
    method: "post",
    url: "/product/getById",
  },
  getSubCategory: {
    method: "get",
    url: "/subcategory/get",
  },
  login: {
    method: "post",
    url: "/auth/login",
  },
  logout: {
    method: "post",
    url: "/auth/logout",
  },
  refreshToken: {
    method: "post",
    url: "/auth/refresh-token",
  },
  register: {
    method: "post",
    url: "/auth/register",
  },
  resetPassword: {
    method: "post",
    url: "/auth/reset-password",
  },
  updateCategory: {
    method: "put",
    url: "/category/update",
  },
  updateProduct: {
    method: "put",
    url: "/product/update",
  },
  updateSubCategory: {
    method: "put",
    url: "/subcategory/update",
  },
  updateUserDetails: {
    method: "patch",
    url: "/users/update-user",
  },
  uploadAvatar: {
    method: "put",
    url: "/users/upload-avatar",
  },
  uploadImage: {
    method: "post",
    url: "/upload/image",
  },
  userDetails: {
    method: "get",
    url: "/users/me",
  },
  verifyEmail: {
    method: "post",
    url: "/auth/verify-email",
  },
  verifyForgotPasswordOtp: {
    method: "post",
    url: "/auth/verify-forgot-password-otp",
  },
};

export default SummaryApi;
