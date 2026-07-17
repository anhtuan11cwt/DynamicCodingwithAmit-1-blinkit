import { useCallback, useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import SummaryApi from "../common/SummaryApi";
import CardLoading from "../components/CardLoading";
import CardProduct from "../components/CardProduct";
import Axios from "../utils/Axios";
import AxiosToastError from "../utils/AxiosToastError";
import validURLConvert from "../utils/validURLConvert";

const loadingGridClass =
  "grid grid-cols-2 gap-4 min-[480px]:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5";

const initialLoadingCards = Array.from({ length: 10 }, (_, index) => ({
  _id: `initial-loading-${index}`,
}));

const moreLoadingCards = Array.from({ length: 5 }, (_, index) => ({
  _id: `more-loading-${index}`,
}));

const ProductListInner = ({ categoryId, categorySlug, subCategoryId }) => {
  const navigate = useNavigate();
  const allSubCategory = useSelector((state) => state.product.allSubCategory);

  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const filterSubCategory = allSubCategory.filter((sub) =>
    sub.category?.some((cat) => cat._id === categoryId),
  );

  const hasMore = products.length < totalCount;

  const fetchProducts = useCallback(
    async (pageNumber = 1) => {
      try {
        if (pageNumber === 1) {
          setInitialLoading(true);
        } else {
          setLoading(true);
        }

        const response = await Axios({
          ...SummaryApi.getProductByCategoryAndSubCategory,
          data: {
            categoryId,
            limit: 15,
            page: pageNumber,
            subCategoryId,
          },
        });

        if (response.data.success) {
          const newItems = response.data.data || [];

          setProducts((prev) =>
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
    [categoryId, subCategoryId],
  );

  useEffect(() => {
    window.scrollTo({ behavior: "instant", top: 0 });
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProducts(1);
  }, [fetchProducts]);

  const handleFetchMore = () => {
    if (!hasMore || loading) {
      return;
    }

    const nextPage = page + 1;

    setPage(nextPage);
    fetchProducts(nextPage);
  };

  const handleSubCategoryClick = (sub) => {
    const url = `/${categorySlug}-${categoryId}/${validURLConvert(sub.name)}-${sub._id}`;

    navigate(url);
  };

  const activeSubName =
    filterSubCategory.find((sub) => sub._id === subCategoryId)?.name ||
    "Sản phẩm";

  return (
    <section className="mx-auto px-4 py-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-[100px_1fr] lg:grid-cols-[200px_1fr]">
        <aside className="md:sticky md:top-20 md:h-fit md:self-start lg:top-24">
          <h2 className="mb-2 font-semibold text-lg">Danh mục con</h2>

          <div className="flex gap-2 overflow-x-auto pb-2 md:flex-col md:gap-1 md:overflow-visible md:pb-0">
            {filterSubCategory.map((sub) => {
              const isActive = sub._id === subCategoryId;

              return (
                <button
                  aria-current={isActive ? "true" : undefined}
                  className={`shrink-0 cursor-pointer rounded-lg px-3 py-2 text-left text-sm transition-colors focus-visible:ring-2 focus-visible:ring-green-600 ${
                    isActive
                      ? "bg-green-100 font-semibold text-green-700"
                      : "text-secondary-100 hover:bg-gray-100"
                  }`}
                  key={sub._id}
                  onClick={() => handleSubCategoryClick(sub)}
                  type="button"
                >
                  {sub.name}
                </button>
              );
            })}

            {filterSubCategory.length === 0 && (
              <p className="text-gray-500 text-sm">Chưa có danh mục con nào.</p>
            )}
          </div>
        </aside>

        <div>
          <h1 className="mb-4 font-semibold text-xl">{activeSubName}</h1>

          {initialLoading ? (
            <div className={loadingGridClass}>
              {initialLoadingCards.map((card) => (
                <CardLoading key={card._id} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="rounded-lg border border-gray-200 border-dashed py-16 text-center">
              <p className="text-gray-500 text-sm">
                Chưa có sản phẩm trong danh mục này.
              </p>
            </div>
          ) : (
            <InfiniteScroll
              dataLength={products.length}
              hasMore={hasMore}
              loader={
                <div className={loadingGridClass}>
                  {moreLoadingCards.map((card) => (
                    <CardLoading key={card._id} />
                  ))}
                </div>
              }
              next={handleFetchMore}
              scrollThreshold={0.85}
            >
              <div className={loadingGridClass}>
                {products.map((product) => (
                  <CardProduct data={product} key={product._id} />
                ))}
              </div>
            </InfiniteScroll>
          )}
        </div>
      </div>
    </section>
  );
};

const ProductListPage = () => {
  const params = useParams();

  const categoryId = params.category?.split("-").slice(-1)[0];
  const categorySlug = params.category?.split("-").slice(0, -1).join("-");
  const subCategoryId = params.subcategory?.split("-").slice(-1)[0];

  return (
    <ProductListInner
      categoryId={categoryId}
      categorySlug={categorySlug}
      key={`${categoryId}-${subCategoryId}`}
      subCategoryId={subCategoryId}
    />
  );
};

export default ProductListPage;
