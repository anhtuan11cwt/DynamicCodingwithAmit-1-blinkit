import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Banner from "../assets/banner.jpg";
import BannerMobile from "../assets/banner-mobile.jpg";
import CategoryWiseProductDisplay from "../components/CategoryWiseProductDisplay";
import validURLConvert from "../utils/validURLConvert";

const SKELETON_CATEGORIES = Array.from({ length: 20 }, (_, index) => ({
  _id: `skeleton-${index}`,
}));

const Home = () => {
  const [isLoading, setIsLoading] = useState(true);
  const loadingCategory = useSelector((state) => state.product.loadingCategory);
  const categoryData = useSelector((state) => state.product.allCategory);
  const subCategoryData = useSelector((state) => state.product.allSubCategory);
  const navigate = useNavigate();

  const categories = loadingCategory ? SKELETON_CATEGORIES : categoryData;

  const handleRedirectProductListPage = (categoryId, categoryName) => {
    const filterData = subCategoryData.filter((subCategory) =>
      subCategory.category.some((cat) => cat._id === categoryId),
    );

    const subCategory = filterData[0];

    if (!subCategory) {
      return;
    }

    const url = `/${validURLConvert(categoryName)}-${categoryId}/${validURLConvert(
      subCategory.name,
    )}-${subCategory._id}`;

    navigate(url);
  };

  return (
    <>
      <section
        className={`mx-auto mb-4 overflow-hidden rounded-lg px-4 ${
          isLoading ? "min-h-32 animate-pulse bg-sky-100" : "bg-white"
        }`}
      >
        <img
          alt="Banner khuyến mãi Blinkit desktop"
          className="hidden h-full w-full object-scale-down md:block"
          onLoad={() => setIsLoading(false)}
          src={Banner}
        />
        <img
          alt="Banner khuyến mãi Blinkit mobile"
          className="block h-full w-full object-scale-down md:hidden"
          onLoad={() => setIsLoading(false)}
          src={BannerMobile}
        />
      </section>

      <div className="mx-auto px-4 py-6">
        <section className="my-4">
          <h2 className="mb-4 font-semibold text-lg">Mua sắm theo danh mục</h2>

          <div className="grid grid-cols-4 gap-4 md:grid-cols-7 lg:grid-cols-10">
            {categories.map((category) => (
              <button
                className={`group relative flex h-full flex-col overflow-hidden rounded-lg border border-gray-100 bg-white shadow transition-all duration-300 hover:shadow-lg ${
                  loadingCategory ? "animate-pulse" : "cursor-pointer"
                }`}
                key={category._id}
                onClick={
                  loadingCategory
                    ? undefined
                    : () =>
                        handleRedirectProductListPage(
                          category._id,
                          category.name,
                        )
                }
                type="button"
              >
                {loadingCategory ? (
                  <>
                    <div className="aspect-square w-full shrink-0 overflow-hidden bg-gray-50 p-3">
                      <div className="h-full w-full rounded bg-blue-100" />
                    </div>
                    <div className="mt-auto px-2 py-2">
                      <div className="mx-auto h-4 w-3/4 rounded bg-blue-100" />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="aspect-square w-full shrink-0 overflow-hidden bg-gray-50 p-3">
                      <img
                        alt={category.name}
                        className="h-full w-full object-contain"
                        src={category.image}
                      />
                    </div>
                    <p className="mt-auto truncate px-2 py-2 text-center font-medium text-secondary-100 text-sm">
                      {category.name}
                    </p>
                  </>
                )}
              </button>
            ))}
          </div>
        </section>
      </div>

      <div className="mx-auto px-4">
        {!loadingCategory &&
          categoryData.map((category) => (
            <CategoryWiseProductDisplay
              id={category._id}
              key={`category-products-${category._id}`}
              name={category.name}
            />
          ))}
      </div>
    </>
  );
};

export default Home;
