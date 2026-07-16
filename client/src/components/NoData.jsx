import noDataImage from "../assets/nothing here yet.webp";

const NoData = ({ message = "Chưa có dữ liệu" }) => {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-3 py-16 text-center">
      <img
        alt=""
        className="w-40 max-w-full object-scale-down opacity-90"
        height={160}
        loading="lazy"
        src={noDataImage}
        width={160}
      />
      <p className="font-medium text-gray-500 text-sm">{message}</p>
    </div>
  );
};

export default NoData;
