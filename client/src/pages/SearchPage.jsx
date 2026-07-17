import { useCallback, useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useLocation } from "react-router-dom";
import SummaryApi from "../common/SummaryApi";
import CardLoading from "../components/CardLoading";
import CardProduct from "../components/CardProduct";
import NoData from "../components/NoData";
import AxiosToastError from "../utils/AxiosToastError";
import Axios from "../utils/axios";

const LIMIT = 12;

const loadingGridClass =
  "grid grid-cols-2 gap-4 min-[480px]:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5";

const initialLoadingCards = Array.from({ length: 10 }, (_, index) => ({
  _id: `search-loading-${index}`,
}));

const SearchPage = () => {
  const location = useLocation();
  const search = new URLSearchParams(location.search).get("q") || "";

  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const hasMore = data.length < totalCount;

  const fetchSearchProduct = useCallback(
    async (pageNumber = 1) => {
      try {
        if (pageNumber === 1) {
          setInitialLoading(true);
        } else {
          setLoading(true);
        }

        const response = await Axios({
          ...SummaryApi.searchProduct,
          data: {
            limit: LIMIT,
            page: pageNumber,
            search,
          },
        });

        if (response.data.success) {
          const newItems = response.data.data || [];

          setData((prev) =>
            pageNumber === 1 ? newItems : [...prev, ...newItems],
          );
          setTotalCount(response.data.totalCount || 0);
        }
      } catch (error) {
        AxiosToastError(error);
      } finally {
        setInitialLoading(false);
        setLoading(false);
      }
    },
    [search],
  );

  useEffect(() => {
    window.scrollTo({ behavior: "instant", top: 0 });
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPage(1);

    setData([]);

    setTotalCount(0);
    fetchSearchProduct(1);
  }, [fetchSearchProduct]);

  const handleFetchMore = () => {
    if (!hasMore || loading) {
      return;
    }

    const nextPage = page + 1;

    setPage(nextPage);
    fetchSearchProduct(nextPage);
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-6">
      <h1 className="mb-4 font-semibold text-xl">
        {search ? `Kết quả tìm kiếm cho "${search}"` : "Tìm kiếm sản phẩm"}
      </h1>

      {initialLoading ? (
        <div className={loadingGridClass}>
          {initialLoadingCards.map((card) => (
            <CardLoading key={card._id} />
          ))}
        </div>
      ) : data.length === 0 ? (
        <NoData message="Không tìm thấy sản phẩm nào" />
      ) : (
        <InfiniteScroll
          dataLength={data.length}
          hasMore={hasMore}
          loader={
            <div className={loadingGridClass}>
              {initialLoadingCards.map((card) => (
                <CardLoading key={card._id} />
              ))}
            </div>
          }
          next={handleFetchMore}
          scrollThreshold={0.85}
        >
          <div className={loadingGridClass}>
            {data.map((product) => (
              <CardProduct data={product} key={product._id} />
            ))}
          </div>
        </InfiniteScroll>
      )}
    </section>
  );
};

export default SearchPage;
