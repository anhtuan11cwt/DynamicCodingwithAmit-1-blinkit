import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Outlet, useLocation } from "react-router-dom";
import Footer from "./components/Footer";
import Header from "./components/Header";
import { setUserDetails } from "./store/userSlice";
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
  const showFooter = !hideFooterRoutes.includes(pathname);
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

  return (
    <>
      <div className="flex min-h-dvh flex-col">
        <Header isHydrated={isHydrated} />
        <main className="flex-1">
          <Outlet />
        </main>
        {showFooter && <Footer />}
      </div>
      <Toaster position="top-center" toastOptions={{ duration: 2000 }} />
    </>
  );
}

export default App;
