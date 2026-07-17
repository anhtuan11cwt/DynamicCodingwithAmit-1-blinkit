const DisplayPriceInVND = (price) => {
  const value = Number(price) || 0;

  return `${value.toLocaleString("vi-VN")} ₫`;
};

export const pricewithDiscount = (price, discount = 0) => {
  const value = Number(price) || 0;
  const percent = Number(discount) || 0;
  const discountAmount = Math.ceil((value * percent) / 100);

  return value - discountAmount;
};

export default DisplayPriceInVND;
