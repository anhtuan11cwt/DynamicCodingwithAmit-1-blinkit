import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import SummaryApi from "../common/SummaryApi";
import AxiosToastError from "../utils/AxiosToastError";
import Axios from "../utils/axios";
import CardLoading from "./CardLoading";
import CardProduct from "./CardProduct";

const loadingCardList = Array.from({ length: 6 }, (_, index) => index);

const CategoryWiseProductDisplay = ({ id, name }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const containerRef = useRef(null);

  const fetchCategoryWiseProduct = useCallback(async () => {
    try {
      setLoading(true);

      const response = await Axios({
        ...SummaryApi.getProductByCategory,
        data: { id },
      });

      if (response.data.success) {
        setData(response.data.data);
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchCategoryWiseProduct();
  }, [fetchCategoryWiseProduct]);

  const handleScroll = (direction) => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    const offset = direction === "left" ? -300 : 300;
    container.scrollBy({ behavior: "smooth", left: offset });
  };

  return (
    <section className="my-6">
      <div className="mb-3 flex items-center justify-between gap-4">
        <h2 className="font-semibold text-lg">{name}</h2>
      </div>

      <div className="relative">
        <button
          aria-label={`Cuộn ${name} sang trái`}
          className="absolute top-1/2 left-0 z-10 hidden -translate-y-1/2 cursor-pointer rounded-full border border-gray-200 bg-white p-2 text-secondary-100 shadow-md transition-colors hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-green-600 lg:flex"
          onClick={() => handleScroll("left")}
          type="button"
        >
          <ChevronLeft aria-hidden="true" size={18} />
        </button>

        <button
          aria-label={`Cuộn ${name} sang phải`}
          className="absolute top-1/2 right-0 z-10 hidden -translate-y-1/2 cursor-pointer rounded-full border border-gray-200 bg-white p-2 text-secondary-100 shadow-md transition-colors hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-green-600 lg:flex"
          onClick={() => handleScroll("right")}
          type="button"
        >
          <ChevronRight aria-hidden="true" size={18} />
        </button>

        <div
          className="flex items-stretch gap-4 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          ref={containerRef}
        >
          {loading
            ? loadingCardList.map((cardId) => (
                <CardLoading key={`loading-${id}-${cardId}`} />
              ))
            : data.map((product) => (
                <CardProduct data={product} key={product._id} />
              ))}

          {!loading && data.length === 0 && (
            <p className="py-6 text-gray-500 text-sm">
              Chưa có sản phẩm trong danh mục này.
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default CategoryWiseProductDisplay;
