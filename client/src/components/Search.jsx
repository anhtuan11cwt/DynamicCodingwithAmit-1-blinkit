import { Search as SearchGlass } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { TypeAnimation } from "react-type-animation";

const keywords = [
  "Sữa",
  1200,
  "Bánh mì",
  1200,
  "Đường",
  1200,
  "Paneer",
  1200,
  "Gạo",
  1200,
  "Dầu ăn",
  1200,
  "Xà phòng",
  1200,
  "Bánh quy",
  1200,
  "Socola",
  1200,
  "Rau củ",
  1200,
  "Trái cây",
  1200,
];

const baseClasses =
  "group flex h-12 w-full min-w-0 items-center gap-3 rounded-lg border border-gray-300 bg-gray-50 px-3 transition-all duration-200 hover:border-primary-200 focus-within:border-primary-200";

const SearchIcon = ({ className }) => (
  <SearchGlass
    aria-hidden="true"
    className={`shrink-0 text-gray-400 transition-colors group-focus-within:text-primary-200 group-hover:text-primary-200 ${className ?? ""}`}
    size={20}
  />
);

const Search = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isSearchPage = pathname === "/search";

  if (isSearchPage) {
    return (
      <div className={baseClasses}>
        <SearchIcon />
        <input
          aria-label="Tìm kiếm sản phẩm"
          className="w-full bg-transparent text-gray-800 text-sm outline-none placeholder:text-gray-400"
          placeholder="Tìm kiếm sản phẩm..."
          type="search"
        />
      </div>
    );
  }

  return (
    <button
      aria-label="Tìm kiếm sản phẩm"
      className={`${baseClasses} cursor-pointer text-left`}
      onClick={() => navigate("/search")}
      type="button"
    >
      <SearchIcon />
      <span className="truncate text-gray-400 text-sm">
        Tìm kiếm{" "}
        <TypeAnimation
          className="text-gray-400"
          cursor
          repeat={Number.POSITIVE_INFINITY}
          sequence={keywords}
          speed={50}
          wrapper="span"
        />
      </span>
    </button>
  );
};

export default Search;
