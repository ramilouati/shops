import { useContextElement } from "@/context/Context";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { Link } from "react-router-dom";

export default function Categories() {
  const { catalog } = useContextElement();
  const categories = [...new Map(
    catalog
      .filter((product) => product.category)
      .map((product) => [product.category, product])
  ).values()];
  const swiperOptions = {
    autoplay: {
      delay: 5000,
    },
    modules: [Autoplay],
    slidesPerView: 8,
    slidesPerGroup: 1,
    effect: "none",
    loop: false,
    breakpoints: {
      320: {
        slidesPerView: 2,
        slidesPerGroup: 2,
        spaceBetween: 15,
      },
      768: {
        slidesPerView: 4,
        slidesPerGroup: 4,
        spaceBetween: 30,
      },
      992: {
        slidesPerView: 6,
        slidesPerGroup: 1,
        spaceBetween: 45,
        pagination: false,
      },
      1200: {
        slidesPerView: 8,
        slidesPerGroup: 1,
        spaceBetween: 60,
        pagination: false,
      },
    },
  };
  return (
    <section className="category-carousel container">
      <h2 className="section-title text-center fw-normal mb-3 pb-xl-2 mb-xl-4">
        Catégories populaires
      </h2>

      <div className="position-relative">
        <Swiper
          className="swiper-container js-swiper-slider"
          {...swiperOptions}
        >
          {categories.map((elm) => (
            <SwiperSlide key={elm.category} className="swiper-slide">
              <img
                loading="lazy"
                className="w-100 mb-3 h-auto"
                src={elm.imgSrc}
                width="124"
                height="124"
                alt={elm.category}
              />
              <div className="text-center">
                <Link to={`/shop-1?category=${encodeURIComponent(elm.category)}`} className="menu-link fw-medium">
                  {elm.category}
                </Link>
              </div>
            </SwiperSlide>
          ))}

          {/* <!-- /.swiper-wrapper --> */}
        </Swiper>
        {/* <!-- /.swiper-container js-swiper-slider --> */}
      </div>
      {/* <!-- /.position-relative --> */}
    </section>
  );
}
