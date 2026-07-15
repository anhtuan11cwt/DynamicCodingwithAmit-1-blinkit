import { ArrowLeft, LogIn, Menu, User, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import useMobile from "../hooks/useMobile";
import Cart from "./Cart";
import SearchBar from "./Search";

const mobileLinks = [
  { label: "Trang chủ", to: "/" },
  { label: "Danh mục", to: "/categories" },
  { label: "Ưu đãi", to: "/offers" },
];

const totalQty = 3;
const totalPrice = 15000;

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef(null);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isMobile = useMobile();
  const isSearchPage = pathname === "/search";
  const hideLogoAndUser = isMobile && isSearchPage;

  useEffect(() => {
    if (!menuOpen) return;

    const handlePointerDown = (event) => {
      if (headerRef.current && !headerRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md" ref={headerRef}>
      <div className="mx-auto hidden h-20 max-w-7xl items-center justify-between px-3 lg:flex">
        <Link
          aria-label="Trang chủ Blinkit"
          className="flex shrink-0 cursor-pointer items-center"
          to="/"
        >
          <img alt="Blinkit" className="w-32" src={logo} />
        </Link>

        <div className="flex-1 px-6">
          <SearchBar />
        </div>

        <div className="flex items-center gap-4">
          <Link
            className="flex cursor-pointer items-center gap-1.5 font-semibold text-secondary-100 outline-none transition-colors duration-200 hover:text-primary-200 focus-visible:ring-2 focus-visible:ring-primary-200"
            to="/login"
          >
            <LogIn aria-hidden="true" size={20} />
            Đăng nhập
          </Link>
          <Cart totalPrice={totalPrice} totalQty={totalQty} />
        </div>
      </div>

      <div className="lg:hidden">
        {isSearchPage ? (
          <div className="flex h-16 items-center gap-2 px-3">
            <button
              aria-label="Quay lại"
              className="flex cursor-pointer items-center justify-center rounded-lg p-2.5 text-secondary-100 outline-none transition-colors hover:bg-gray-100 focus-visible:ring-2 focus-visible:ring-primary-200"
              onClick={() => navigate(-1)}
              type="button"
            >
              <ArrowLeft aria-hidden="true" size={22} />
            </button>
            <div className="flex-1">
              <SearchBar />
            </div>
          </div>
        ) : (
          <div className="flex h-24 flex-col justify-center gap-2 px-3">
            <div className="flex items-center justify-between">
              {!hideLogoAndUser && (
                <Link
                  aria-label="Trang chủ Blinkit"
                  className="flex shrink-0 cursor-pointer items-center"
                  to="/"
                >
                  <img alt="Blinkit" className="w-10" src={logo} />
                </Link>
              )}
              <div className="flex items-center gap-2">
                {!hideLogoAndUser && (
                  <Link
                    aria-label="Tài khoản"
                    className="flex cursor-pointer items-center justify-center rounded-lg p-2.5 text-secondary-100 outline-none transition-colors hover:bg-gray-100 focus-visible:ring-2 focus-visible:ring-primary-200"
                    to="/login"
                  >
                    <User aria-hidden="true" size={22} />
                  </Link>
                )}
                <button
                  aria-controls="mobile-menu"
                  aria-expanded={menuOpen}
                  aria-label={menuOpen ? "Đóng menu" : "Mở menu"}
                  className="flex cursor-pointer items-center justify-center rounded-lg p-2.5 text-secondary-100 outline-none transition-colors hover:bg-gray-100 focus-visible:ring-2 focus-visible:ring-primary-200"
                  onClick={() => setMenuOpen((open) => !open)}
                  type="button"
                >
                  {menuOpen ? (
                    <X aria-hidden="true" size={24} />
                  ) : (
                    <Menu aria-hidden="true" size={24} />
                  )}
                </button>
              </div>
            </div>
            <SearchBar />
          </div>
        )}
      </div>

      <div
        className={`overflow-hidden border-gray-100 border-t bg-white transition-[max-height,opacity] duration-300 ease-out lg:hidden ${
          menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        } motion-reduce:transition-none`}
        id="mobile-menu"
      >
        <nav
          aria-label="Điều hướng di động"
          className="mx-auto max-w-7xl px-3 py-3"
        >
          <ul className="flex flex-col">
            {mobileLinks.map((link) => (
              <li key={link.to}>
                <Link
                  className="block cursor-pointer rounded-lg px-3 py-3 font-medium text-gray-700 text-sm outline-none transition-colors hover:bg-gray-100 focus-visible:ring-2 focus-visible:ring-primary-200"
                  onClick={() => setMenuOpen(false)}
                  to={link.to}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-2 flex items-center gap-2 border-gray-100 border-t pt-3">
            <Link
              className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg bg-gray-100 px-4 py-3 font-medium text-secondary-100 text-sm outline-none transition-colors hover:bg-gray-200 focus-visible:ring-2 focus-visible:ring-primary-200"
              onClick={() => setMenuOpen(false)}
              to="/login"
            >
              <User aria-hidden="true" size={20} />
              <span>Đăng nhập</span>
            </Link>
            <Cart
              onClick={() => setMenuOpen(false)}
              totalPrice={totalPrice}
              totalQty={totalQty}
            />
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
