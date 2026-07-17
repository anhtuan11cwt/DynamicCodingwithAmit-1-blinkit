import { Boxes, ChevronRight, Home, Truck, Wallet } from "lucide-react";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import toast from "react-hot-toast";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { Link, useParams } from "react-router-dom";
import SummaryApi from "../common/SummaryApi";
import AddToCartButton, {
  QuantityStepper,
} from "../components/AddToCartButton";
import AxiosToastError from "../utils/AxiosToastError";
import Axios from "../utils/axios";
import priceWithDiscount from "../utils/priceWithDiscount";
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
  const finalPrice = priceWithDiscount(data.price, data.discount);
  const isOutOfStock = Number(data.stock) <= 0;

  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    // TODO: integrate with cart API / cart slice when available
    toast.success(`Đã thêm ${quantity} × ${data.name} vào giỏ hàng`);
  };

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
        <div className="h-fit self-start">
          <div className="flex aspect-square w-full items-center justify-center rounded-lg border border-gray-100 bg-white p-4">
            {image && (
              <img
                alt={data.name || "Sản phẩm"}
                className="h-full w-full object-scale-down"
                src={image}
              />
            )}
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

          {data.unit && <p className="text-gray-500 text-sm">{data.unit}</p>}

          {hasDiscount && (
            <span className="w-fit rounded-full bg-green-100 px-3 py-1 font-semibold text-green-700 text-sm">
              {data.discount}% OFF
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

          {isOutOfStock ? (
            <p className="font-semibold text-lg text-red-600">Hết hàng</p>
          ) : (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <QuantityStepper
                onChange={setQuantity}
                quantity={quantity}
                stock={Number(data.stock)}
              />
              <AddToCartButton
                onAdd={handleAddToCart}
                stock={Number(data.stock)}
              />
            </div>
          )}

          {data.description && (
            <div>
              <h2 className="mb-1 font-semibold text-secondary-100">
                Mô tả sản phẩm
              </h2>
              <p className="whitespace-pre-line text-secondary-100 text-sm leading-relaxed">
                {data.description}
              </p>
            </div>
          )}

          {Object.keys(data.more_details || {}).length > 0 && (
            <div>
              <h2 className="mb-2 font-semibold text-secondary-100">
                Thông tin chi tiết
              </h2>
              <dl className="flex flex-col gap-1.5">
                {Object.keys(data.more_details || {}).map((key) => (
                  <div className="flex gap-2 text-sm" key={key}>
                    <dt className="font-semibold text-secondary-100">{key}</dt>
                    <dd className="text-gray-600">{data.more_details[key]}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>

        <section className="mt-10 lg:col-span-2">
          <h2 className="mb-4 font-semibold text-lg">
            Tại sao nên mua sắm tại đây
          </h2>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="flex flex-col items-start gap-2 rounded-lg border border-gray-100 bg-white p-4">
              <Truck aria-hidden="true" className="text-green-700" size={28} />
              <h3 className="font-semibold text-secondary-100">
                Giao hàng siêu tốc
              </h3>
              <p className="text-gray-500 text-sm">
                Giao hàng trong 10 phút tới tận cửa.
              </p>
            </div>

            <div className="flex flex-col items-start gap-2 rounded-lg border border-gray-100 bg-white p-4">
              <Wallet aria-hidden="true" className="text-green-700" size={28} />
              <h3 className="font-semibold text-secondary-100">Giá tốt nhất</h3>
              <p className="text-gray-500 text-sm">
                Giá cả phải chăng mỗi ngày.
              </p>
            </div>

            <div className="flex flex-col items-start gap-2 rounded-lg border border-gray-100 bg-white p-4">
              <Boxes aria-hidden="true" className="text-green-700" size={28} />
              <h3 className="font-semibold text-secondary-100">
                Đa dạng sản phẩm
              </h3>
              <p className="text-gray-500 text-sm">
                Hàng ngàn sản phẩm để lựa chọn.
              </p>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
};

export default ProductDisplayPage;
