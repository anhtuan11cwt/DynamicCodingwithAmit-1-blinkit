const SummaryApi = {
  forgotPassword: {
    method: "post",
    url: "/auth/forgot-password",
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
