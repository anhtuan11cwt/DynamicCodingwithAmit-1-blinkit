import { Link } from "react-router-dom";
import DisplayPriceInVND from "../utils/DisplayPriceInVND";
import priceWithDiscount from "../utils/priceWithDiscount";
import validURLConvert from "../utils/validURLConvert";
import AddToCartButton from "./AddToCartButton";

const CardProduct = ({ data }) => {
  const url = `/product/${validURLConvert(data.name)}-${data._id}`;
  const hasDiscount = Number(data.discount) > 0;
  const finalPrice = priceWithDiscount(data.price, data.discount);

  return (
    <Link
      aria-label={`Xem chi tiết ${data.name}`}
      className="flex h-full w-full min-w-36 max-w-52 shrink-0 snap-start flex-col gap-2 rounded-lg border border-gray-100 bg-white p-3 shadow transition-shadow duration-300 hover:shadow-lg"
      to={url}
    >
      <div className="relative aspect-square w-full overflow-hidden rounded bg-gray-50">
        <img
          alt={data.name}
          className="h-full w-full object-scale-down transition-transform duration-300 hover:scale-105"
          loading="lazy"
          src={data.image?.[0]}
        />

        <span className="absolute top-1 left-1 rounded-full bg-green-100 px-2 py-0.5 font-medium text-green-700 text-xs">
          10 phút
        </span>

        {hasDiscount && (
          <span className="absolute right-1 bottom-1 rounded-full bg-red-50 px-2 py-0.5 font-medium text-red-600 text-xs">
            Giảm {data.discount}%
          </span>
        )}
      </div>

      <p className="line-clamp-2 h-10 font-medium text-secondary-100 text-sm leading-5">
        {data.name}
      </p>

      <div className="mt-auto flex flex-col gap-2">
        <p className="text-gray-500 text-xs">{data.unit}</p>

        <div className="flex items-baseline gap-1.5">
          <p className="font-semibold text-sm">
            {DisplayPriceInVND(finalPrice)}
          </p>

          {hasDiscount && (
            <p className="text-gray-400 text-xs line-through">
              {DisplayPriceInVND(data.price)}
            </p>
          )}
        </div>

        <AddToCartButton compact product={data} />
      </div>
    </Link>
  );
};

export default CardProduct;
