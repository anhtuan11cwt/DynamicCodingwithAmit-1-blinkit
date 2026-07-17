import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Outlet, useLocation } from "react-router-dom";
import SummaryApi from "./common/SummaryApi";
import CardMobileLink from "./components/CardMobileLink";
import Footer from "./components/Footer";
import Header from "./components/Header";
import GlobalProvider from "./provider/GlobalProvider";
import {
  setAllCategory,
  setAllSubCategory,
  setLoadingCategory,
} from "./store/productSlice";
import { setUserDetails } from "./store/userSlice";
import Axios from "./utils/axios";
import fetchUserDetails from "./utils/fetchUserDetails";

const hideFooterRoutes = [
  "/register",
  "/login",
  "/verify-email",
  "/forgot-password",
  "/verification-otp",
  "/reset-password",
];

function App() {
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const showFooter =
    !hideFooterRoutes.includes(pathname) && !pathname.startsWith("/dashboard");
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const hydrateUser = async () => {
      const userDetails = await fetchUserDetails();
      if (userDetails?.data) {
        dispatch(setUserDetails(userDetails.data));
      }
      setIsHydrated(true);
    };
    hydrateUser();
  }, [dispatch]);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        dispatch(setLoadingCategory(true));
        const response = await Axios({ ...SummaryApi.getCategory });
        if (response.data.success) {
          dispatch(setAllCategory(response.data.data));
        }
      } catch {
        // Bỏ qua lỗi nền: các trang sẽ tự tải lại khi cần
      } finally {
        dispatch(setLoadingCategory(false));
      }
    };

    const fetchSubCategory = async () => {
      try {
        const response = await Axios({ ...SummaryApi.getSubCategory });
        if (response.data.success) {
          dispatch(setAllSubCategory(response.data.data));
        }
      } catch {
        // Bỏ qua lỗi nền
      }
    };

    fetchCategory();
    fetchSubCategory();
  }, [dispatch]);

  return (
    <GlobalProvider>
      <div className="flex min-h-dvh flex-col">
        <Header isHydrated={isHydrated} />
        <main className="flex-1">
          <Outlet />
        </main>
        {showFooter && <Footer />}
        <CardMobileLink />
      </div>
      <Toaster position="top-center" toastOptions={{ duration: 2000 }} />
    </GlobalProvider>
  );
}

export default App;
