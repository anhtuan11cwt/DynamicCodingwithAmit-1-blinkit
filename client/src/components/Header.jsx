import { Menu, Search, ShoppingCart, User, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import SearchBar from "./Search";

const mobileLinks = [
  { label: "Trang chủ", to: "/" },
  { label: "Danh mục", to: "/categories" },
  { label: "Ưu đãi", to: "/offers" },
];

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef(null);
  const navigate = useNavigate();

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
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-3">
        <Link
          aria-label="Trang chủ Blinkit"
          className="flex shrink-0 cursor-pointer items-center"
          to="/"
        >
          <img alt="Blinkit" className="hidden w-32 lg:block" src={logo} />
          <img alt="Blinkit" className="block w-10 lg:hidden" src={logo} />
        </Link>

        <div className="hidden flex-1 px-6 lg:block">
          <SearchBar />
        </div>

        <div className="hidden items-center gap-2 lg:flex">
          <Link
            className="flex cursor-pointer items-center gap-2 rounded-lg px-4 py-2.5 font-medium text-secondary-100 text-sm outline-none transition-colors hover:bg-gray-100 focus-visible:ring-2 focus-visible:ring-primary-200"
            to="/login"
          >
            <User aria-hidden="true" size={20} />
            <span>Đăng nhập</span>
          </Link>
          <button
            aria-label="Giỏ hàng"
            className="relative flex cursor-pointer items-center justify-center rounded-lg bg-primary-200 p-2.5 text-secondary-200 outline-none transition-colors hover:bg-primary-100 focus-visible:ring-2 focus-visible:ring-secondary-100"
            type="button"
          >
            <ShoppingCart aria-hidden="true" size={20} />
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-secondary-100 font-semibold text-white text-xs">
              0
            </span>
          </button>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <button
            aria-label="Tìm kiếm"
            className="flex cursor-pointer items-center justify-center rounded-lg p-2.5 text-secondary-100 outline-none transition-colors hover:bg-gray-100 focus-visible:ring-2 focus-visible:ring-primary-200"
            onClick={() => navigate("/search")}
            type="button"
          >
            <Search aria-hidden="true" size={22} />
          </button>
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
            <button
              aria-label="Giỏ hàng"
              className="relative flex cursor-pointer items-center justify-center rounded-lg bg-primary-200 px-4 py-3 text-secondary-200 outline-none transition-colors hover:bg-primary-100 focus-visible:ring-2 focus-visible:ring-secondary-100"
              onClick={() => setMenuOpen(false)}
              type="button"
            >
              <ShoppingCart aria-hidden="true" size={20} />
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-secondary-100 font-semibold text-white text-xs">
                0
              </span>
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
