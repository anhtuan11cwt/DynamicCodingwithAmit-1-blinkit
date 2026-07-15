import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "../App";
import AuthRoute from "../components/AuthRoute";
import Dashboard from "../layouts/Dashboard";
import Addresses from "../pages/Addresses";
import ForgotPassword from "../pages/ForgotPassword";
import Home from "../pages/Home";
import Login from "../pages/Login";
import MyOrders from "../pages/MyOrders";
import OTPVerification from "../pages/OTPVerification";
import Profile from "../pages/Profile";
import Register from "../pages/Register";
import ResetPassword from "../pages/ResetPassword";
import SearchPage from "../pages/SearchPage";
import VerifyEmail from "../pages/VerifyEmail";

const router = createBrowserRouter([
  {
    children: [
      {
        element: <Home />,
        path: "",
      },
      {
        element: <SearchPage />,
        path: "search",
      },
      {
        element: (
          <AuthRoute>
            <Register />
          </AuthRoute>
        ),
        path: "register",
      },
      {
        element: (
          <AuthRoute>
            <Login />
          </AuthRoute>
        ),
        path: "login",
      },
      {
        element: (
          <AuthRoute>
            <VerifyEmail />
          </AuthRoute>
        ),
        path: "verify-email",
      },
      {
        element: (
          <AuthRoute>
            <ForgotPassword />
          </AuthRoute>
        ),
        path: "forgot-password",
      },
      {
        element: (
          <AuthRoute>
            <OTPVerification />
          </AuthRoute>
        ),
        path: "verification-otp",
      },
      {
        element: (
          <AuthRoute>
            <ResetPassword />
          </AuthRoute>
        ),
        path: "reset-password",
      },
      {
        children: [
          {
            element: <Navigate replace to="profile" />,
            index: true,
          },
          {
            element: <Profile />,
            path: "profile",
          },
          {
            element: <MyOrders />,
            path: "myorders",
          },
          {
            element: <Addresses />,
            path: "address",
          },
        ],
        element: <Dashboard />,
        path: "dashboard",
      },
    ],
    element: <App />,
    path: "/",
  },
]);

export default router;
