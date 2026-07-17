const DisplayPriceInVND = (price) => {
  const value = Number(price) || 0;

  return `${value.toLocaleString("vi-VN")} ₫`;
};

export { default as pricewithDiscount } from "./priceWithDiscount";

export default DisplayPriceInVND;
