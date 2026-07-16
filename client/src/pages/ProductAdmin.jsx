import { useCallback, useEffect, useRef, useState } from "react";
import { IoSearch } from "react-icons/io5";
import SummaryApi from "../common/SummaryApi";
import ProductCardAdmin from "../components/ProductCardAdmin";
import Axios from "../utils/axios";

const ProductAdmin = () => {
  const [productData, setProductData] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [totalPage, setTotalPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const firstRender = useRef(true);

  const fetchProductData = useCallback(async () => {
    try {
      setLoading(true);

      const response = await Axios({
        ...SummaryApi.getProduct,
        data: {
          limit,
          page,
          search,
        },
      });

      if (response.data.success) {
        setProductData(response.data.data);
        setTotalPage(response.data.totalPage);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }, [limit, page, search]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProductData();
  }, [fetchProductData]);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    const timer = setTimeout(() => {
      fetchProductData();
    }, 300);

    return () => clearTimeout(timer);
  }, [fetchProductData]);

  const handlePrevious = () => {
    if (page > 1) {
      setPage((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (page < totalPage) {
      setPage((prev) => prev + 1);
    }
  };

  const handleOnChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  return (
    <div>
      <div className="flex flex-col gap-3 rounded-md bg-white px-4 py-3 shadow sm:flex-row sm:items-center sm:justify-between">
        <h2 className="font-semibold text-lg">Sản phẩm</h2>

        <div className="flex w-full items-center rounded-md bg-white px-3 py-2 shadow sm:max-w-md">
          <IoSearch className="text-gray-400" />
          <input
            className="w-full px-2 outline-none"
            onChange={handleOnChange}
            placeholder="Tìm sản phẩm..."
            type="text"
            value={search}
          />
        </div>
      </div>

      {loading && (
        <div className="mt-5 text-center text-gray-500">Đang tải...</div>
      )}

      <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
        {productData.map((product) => (
          <ProductCardAdmin data={product} key={product._id} />
        ))}
      </div>

      <div className="mt-8 flex items-center justify-center gap-5">
        <button
          className="rounded-md border bg-white px-4 py-2 disabled:cursor-not-allowed disabled:opacity-40"
          disabled={page === 1}
          onClick={handlePrevious}
          type="button"
        >
          Trang trước
        </button>

        <p>
          {page} / {totalPage}
        </p>

        <button
          className="rounded-md border bg-white px-4 py-2 disabled:cursor-not-allowed disabled:opacity-40"
          disabled={page === totalPage}
          onClick={handleNext}
          type="button"
        >
          Trang sau
        </button>
      </div>
    </div>
  );
};

export default ProductAdmin;
