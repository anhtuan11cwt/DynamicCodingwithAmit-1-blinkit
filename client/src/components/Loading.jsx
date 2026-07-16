import { Loader2 } from "lucide-react";

const Loading = ({ label = "Đang tải..." }) => {
  return (
    <div
      aria-live="polite"
      className="flex w-full flex-col items-center justify-center gap-3 py-16"
      role="status"
    >
      <Loader2
        aria-hidden="true"
        className="animate-spin text-primary-200"
        size={40}
      />
      <p className="text-gray-500 text-sm">{label}</p>
    </div>
  );
};

export default Loading;
