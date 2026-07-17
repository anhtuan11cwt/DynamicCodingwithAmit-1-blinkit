const priceWithDiscount = (price, discount = 0) => {
  const value = Number(price) || 0;
  const percent = Number(discount) || 0;
  const discountAmount = (value * percent) / 100;
  const finalPrice = value - discountAmount;

  return Math.round(finalPrice);
};

export default priceWithDiscount;
