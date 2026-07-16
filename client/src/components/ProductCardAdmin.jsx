const ProductCardAdmin = ({ data }) => {
  return (
    <div className="overflow-hidden rounded-lg bg-white shadow duration-300 hover:shadow-lg">
      <img
        alt={data.name}
        className="h-40 w-full object-cover"
        src={data.image?.[0]}
      />

      <div className="p-3">
        <p className="line-clamp-2 font-medium">{data.name}</p>

        <p className="mt-2 text-gray-500 text-sm">{data.unit}</p>
      </div>
    </div>
  );
};

export default ProductCardAdmin;
