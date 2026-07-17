import { ChevronRight, Home } from "lucide-react";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { Link, useParams } from "react-router-dom";
import SummaryApi from "../common/SummaryApi";
import AxiosToastError from "../utils/AxiosToastError";
import Axios from "../utils/axios";
import { pricewithDiscount } from "../utils/DisplayPriceInVND";
import validURLConvert from "../utils/validURLConvert";

const ProductDisplayPage = () => {
  const params = useParams();
  const productId = params.product?.split("-").slice(-1)[0];

  const [data, setData] = useState({});
  const [image, setImage] = useState("");
  const [canScroll, setCanScroll] = useState(false);

  const imageContainer = useRef(null);

  const fetchProductDetails = useCallback(async () => {
    try {
      const response = await Axios({
        ...SummaryApi.productDetails,
        data: { _id: productId },
      });

      if (response.data.success) {
        setData(response.data.data);
      }
    } catch (error) {
      AxiosToastError(error);
    }
  }, [productId]);

  useEffect(() => {
    window.scrollTo({ behavior: "instant", top: 0 });
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProductDetails();
  }, [fetchProductDetails]);

  useEffect(() => {
    if (data?.image?.length) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setImage(data.image[0]);
    }
  }, [data]);

  useLayoutEffect(() => {
    const el = imageContainer.current;

    if (!el) {
      return;
    }

    const update = () => {
      setCanScroll(el.scrollWidth > el.clientWidth + 1);
    };

    update();

    const observer = new ResizeObserver(update);

    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  const scrollLeft = () => {
    if (imageContainer.current) {
      imageContainer.current.scrollLeft -= 150;
    }
  };

  const scrollRight = () => {
    if (imageContainer.current) {
      imageContainer.current.scrollLeft += 150;
    }
  };

  const hasDiscount = Number(data.discount) > 0;
  const finalPrice = pricewithDiscount(data.price, data.discount);

  return (
    <section className="mx-auto max-w-7xl px-4 py-6">
      <nav aria-label="Breadcrumb" className="mb-4">
        <ol className="flex items-center gap-1.5 text-sm">
          <li className="flex items-center">
            <Link
              className="flex items-center gap-1.5 font-medium text-secondary-100 transition-colors hover:text-green-700 focus-visible:ring-2 focus-visible:ring-green-600"
              to="/"
            >
              <Home aria-hidden="true" size={16} />
              Trang chủ
            </Link>
          </li>

          {data.category?.[0]?._id && data.subCategory?.[0]?._id && (
            <li className="flex items-center gap-1.5">
              <ChevronRight
                aria-hidden="true"
                className="text-gray-400"
                size={16}
              />
              <Link
                className="font-medium text-secondary-100 transition-colors hover:text-green-700 focus-visible:ring-2 focus-visible:ring-green-600"
                to={`/${validURLConvert(data.category[0].name)}-${data.category[0]._id}/${validURLConvert(data.subCategory[0].name)}-${data.subCategory[0]._id}`}
              >
                {data.subCategory[0].name}
              </Link>
            </li>
          )}

          {data.name && (
            <li className="flex items-center gap-1.5">
              <ChevronRight
                aria-hidden="true"
                className="text-gray-400"
                size={16}
              />
              <span aria-current="page" className="font-medium text-gray-500">
                {data.name}
              </span>
            </li>
          )}
        </ol>
      </nav>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="lg:sticky lg:top-24 lg:h-fit lg:self-start">
          <div className="flex items-center justify-center rounded-lg border border-gray-100 bg-white p-4">
            <img
              alt={data.name || "Sản phẩm"}
              className="min-h-64 w-full object-scale-down lg:min-h-[28rem]"
              src={image}
            />
          </div>

          {data.image?.length > 0 && (
            <div className="relative mt-3">
              {canScroll && (
                <button
                  aria-label="Xem ảnh trước"
                  className="absolute top-1/2 left-0 z-10 -translate-y-1/2 cursor-pointer rounded-full bg-white p-1.5 shadow-md transition-colors hover:bg-gray-100 focus-visible:ring-2 focus-visible:ring-green-600"
                  onClick={scrollLeft}
                  type="button"
                >
                  <FaAngleLeft aria-hidden="true" />
                </button>
              )}

              <div
                className="scrollbar-none flex gap-3 overflow-x-auto scroll-smooth"
                ref={imageContainer}
              >
                {data.image.map((img) => (
                  <button
                    aria-label={`Xem ảnh ${data.name || "sản phẩm"}`}
                    className={`h-20 w-20 shrink-0 cursor-pointer rounded border object-scale-down transition-colors focus-visible:ring-2 focus-visible:ring-green-600 ${
                      image === img
                        ? "border-green-600"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    key={img}
                    onClick={() => setImage(img)}
                    type="button"
                  >
                    <img
                      alt=""
                      className="h-full w-full object-scale-down"
                      src={img}
                    />
                  </button>
                ))}
              </div>

              {canScroll && (
                <button
                  aria-label="Xem ảnh tiếp theo"
                  className="absolute top-1/2 right-0 z-10 -translate-y-1/2 cursor-pointer rounded-full bg-white p-1.5 shadow-md transition-colors hover:bg-gray-100 focus-visible:ring-2 focus-visible:ring-green-600"
                  onClick={scrollRight}
                  type="button"
                >
                  <FaAngleRight aria-hidden="true" />
                </button>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <h1 className="font-semibold text-xl lg:text-2xl">{data.name}</h1>

          <p className="text-gray-500 text-sm">{data.unit}</p>

          {hasDiscount && (
            <span className="w-fit rounded-full bg-red-50 px-2 py-0.5 font-medium text-red-600 text-xs">
              Giảm {data.discount}%
            </span>
          )}

          <div className="flex items-baseline gap-2">
            <p className="font-bold text-2xl text-green-700">
              {finalPrice != null && finalPrice !== ""
                ? `${Number(finalPrice).toLocaleString("vi-VN")} ₫`
                : ""}
            </p>

            {hasDiscount && (
              <p className="text-gray-400 text-sm line-through">
                {Number(data.price).toLocaleString("vi-VN")} ₫
              </p>
            )}
          </div>

          {data.description && (
            <p className="whitespace-pre-line text-secondary-100 text-sm leading-relaxed">
              {data.description}
            </p>
          )}

          {data.stock != null && (
            <p className="text-gray-500 text-sm">
              {data.stock > 0 ? `Còn ${data.stock} trong kho` : "Hết hàng"}
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductDisplayPage;
