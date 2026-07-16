import { Check } from "lucide-react";
import { createRoot } from "react-dom/client";
import Swal from "sweetalert2";

const successAlert = ({
  message = "Thành công",
  title = "Thành công",
} = {}) => {
  let iconRoot = null;

  Swal.fire({
    confirmButtonColor: "#16a34a",
    confirmButtonText: "Đóng",
    didOpen: () => {
      const btn = Swal.getConfirmButton();
      if (!btn) return;
      btn.style.display = "inline-flex";
      btn.style.alignItems = "center";
      btn.style.justifyContent = "center";
      btn.style.gap = "6px";
      const iconSpan = document.createElement("span");
      iconSpan.style.display = "inline-flex";
      iconSpan.style.alignItems = "center";
      iconSpan.style.flexShrink = "0";
      btn.prepend(iconSpan);
      iconRoot = createRoot(iconSpan);
      iconRoot.render(<Check size={16} strokeWidth={2} />);
    },
    icon: "success",
    text: message,
    title,
    willClose: () => {
      if (iconRoot) {
        iconRoot.unmount();
        iconRoot = null;
      }
    },
  });
};

export default successAlert;
