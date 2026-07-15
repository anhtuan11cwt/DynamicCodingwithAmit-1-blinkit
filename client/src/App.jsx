import { Toaster } from "react-hot-toast";
import { Outlet, useLocation } from "react-router-dom";
import Footer from "./components/Footer";
import Header from "./components/Header";

const hideFooterRoutes = ["/register", "/login", "/verify-email"];

function App() {
  const { pathname } = useLocation();
  const showFooter = !hideFooterRoutes.includes(pathname);

  return (
    <>
      <div className="flex min-h-dvh flex-col">
        <Header />
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
