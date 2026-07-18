const SummaryApi = {
  addAddress: {
    method: "post",
    url: "/address/create",
  },
  addCategory: {
    method: "post",
    url: "/category/add-category",
  },
  addSubCategory: {
    method: "post",
    url: "/subcategory/add",
  },
  addToCartItem: {
    method: "post",
    url: "/cart/create",
  },
  cashOnDelivery: {
    method: "post",
    url: "/order/cash-on-delivery",
  },
  createProduct: {
    method: "post",
    url: "/product/create",
  },
  deleteAddress: {
    method: "delete",
    url: "/address/delete",
  },
  deleteCartItem: {
    method: "delete",
    url: "/cart/delete",
  },
  deleteCategory: {
    method: "delete",
    url: "/category/delete",
  },
  deleteProduct: {
    method: "delete",
    url: "/product/delete",
  },
  deleteProductDetails: {
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
  getAddress: {
    method: "get",
    url: "/address/get",
  },
  getCartItem: {
    method: "get",
    url: "/cart/get",
  },
  getCategory: {
    method: "get",
    url: "/category/get",
  },
  getMyOrders: {
    method: "get",
    url: "/order/my-order",
  },
  getProduct: {
    method: "post",
    url: "/product/get",
  },
  getProductByCategory: {
    method: "post",
    url: "/product/get-product-by-category",
  },
  getProductByCategoryAndSubCategory: {
    method: "post",
    url: "/product/get-product-category-subcategory",
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
  paymentCheckout: {
    method: "post",
    url: "/payment/checkout",
  },
  paymentSuccess: {
    method: "post",
    url: "/order/payment-success",
  },
  productDetails: {
    method: "post",
    url: "/product/details",
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
  searchProduct: {
    method: "post",
    url: "/product/search-product",
  },
  updateAddress: {
    method: "put",
    url: "/address/update",
  },
  updateCartItem: {
    method: "put",
    url: "/cart/update",
  },
  updateCategory: {
    method: "put",
    url: "/category/update",
  },
  updateProduct: {
    method: "put",
    url: "/product/update",
  },
  updateProductDetails: {
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
