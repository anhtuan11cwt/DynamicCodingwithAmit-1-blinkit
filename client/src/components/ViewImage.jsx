import { useEffect } from "react";
import { IoClose } from "react-icons/io5";

const ViewImage = ({ url, close }) => {
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [close]);

  return (
    <section
      aria-label="Xem ảnh phóng to"
      aria-modal="true"
      className="fixed inset-0 z-[80] flex items-center justify-center p-4"
      role="dialog"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 cursor-pointer bg-black/80"
        onClick={close}
      />

      <button
        aria-label="Đóng"
        className="absolute top-5 right-5 z-10 rounded-lg p-2 text-white outline-none transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white"
        onClick={close}
        type="button"
      >
        <IoClose aria-hidden="true" size={24} />
      </button>

      <img
        alt=""
        className="relative z-10 max-h-[90vh] max-w-[90vw] rounded-lg object-contain shadow-2xl"
        src={url}
      />
    </section>
  );
};

export default ViewImage;
