import { useState } from "react";
import Banner from "../assets/banner.jpg";
import BannerMobile from "../assets/banner-mobile.jpg";

const Home = () => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <section
      className={`container mx-auto my-2 overflow-hidden rounded-lg px-4 md:my-4 ${
        isLoading ? "min-h-32 animate-pulse bg-sky-100" : "bg-white"
      }`}
    >
      <img
        alt="Banner khuyến mãi Blinkit desktop"
        className="hidden h-full w-full object-scale-down md:block"
        onLoad={() => setIsLoading(false)}
        src={Banner}
      />
      <img
        alt="Banner khuyến mãi Blinkit mobile"
        className="block h-full w-full object-scale-down md:hidden"
        onLoad={() => setIsLoading(false)}
        src={BannerMobile}
      />
    </section>
  );
};

export default Home;
