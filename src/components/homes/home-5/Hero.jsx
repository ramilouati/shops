import { heroSlides } from "@/data/home5";
import { Autoplay, EffectFade, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { Link } from "react-router-dom";
import { useRef } from "react";

import { socialLinks } from "@/data/socials";

export default function Hero() {
  const videoRefs = useRef([]);

  const playActive = (swiper) => {
    videoRefs.current.forEach((video, index) => {
      if (!video) return;
      if (index === swiper.realIndex) {
        video.currentTime = 0;
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  };

  const swiperOptions = {
    autoplay: {
      delay: 10000,
      disableOnInteraction: false,
    },
    modules: [Autoplay, Navigation, Pagination, EffectFade],
    navigation: {
      nextEl: ".slideshow__next",
      prevEl: ".slideshow__prev",
    },
    pagination: {
      el: ".slideshow-pagination",
      type: "bullets",
      clickable: true,
    },
    slidesPerView: 1,
    effect: "fade",
    fadeEffect: { crossFade: true },
    loop: false,
    onSlideChange: playActive,
    onSwiper: playActive,
  };

  return (
    <Swiper
      className="swiper-container js-swiper-slider slideshow minh-100 swiper-container-fade"
      {...swiperOptions}
    >
      {heroSlides.map((elm, i) => (
        <SwiperSlide key={elm.id || i} className="swiper-slide">
          <div className="overflow-hidden position-relative h-100">
            <div
              className="slideshow-bg position-absolute top-0 start-0 w-100 h-100"
              style={{ backgroundColor: elm.bgColor || "#111", zIndex: 0 }}
            >
              {elm.videoSrc ? (
                <video
                  ref={(node) => {
                    videoRefs.current[i] = node;
                  }}
                  className="slideshow-bg__img"
                  src={elm.videoSrc}
                  poster={elm.posterSrc || elm.imgSrc}
                  muted
                  loop
                  playsInline
                  autoPlay={i === 0}
                  preload="auto"
                  aria-label={elm.title}
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                  onLoadedData={(event) => {
                    if (i === 0) event.currentTarget.play().catch(() => {});
                  }}
                />
              ) : (
                <img
                  loading="lazy"
                  src={elm.imgSrc}
                  width="1903"
                  height="945"
                  alt=""
                  className="slideshow-bg__img object-fit-cover"
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              )}
            </div>
            <div
              className="position-absolute top-0 start-0 w-100 h-100"
              style={{
                zIndex: 1,
                background:
                  "linear-gradient(180deg, rgba(0,0,0,.15) 0%, rgba(0,0,0,.35) 100%)",
                pointerEvents: "none",
              }}
            />
            <div
              className="slideshow-text container position-absolute start-50 top-50 text-center translate-middle"
              style={{ zIndex: 2 }}
            >
              <h2 className="h1 fw-normal color-white mb-4">{elm.title}</h2>
              <div className="d-flex align-items-center justify-content-center gap-4">
                <Link
                  to="/shop-1"
                  className="btn-link btn-link_lg color-white fw-medium"
                >
                  {elm.ctaLabel || "Voir la boutique"}
                </Link>
                <Link
                  to="/shop-2"
                  className="btn-link btn-link_lg color-white fw-medium"
                >
                  Nouveautés
                </Link>
              </div>
            </div>
          </div>
        </SwiperSlide>
      ))}

      <div className="cursor-pointer slideshow__prev border-0 text-white position-absolute top-50 d-flex align-items-center justify-content-center">
        <svg width="25" height="25" viewBox="0 0 25 25" xmlns="http://www.w3.org/2000/svg">
          <use href="#icon_prev_md" />
        </svg>
      </div>
      <div className="cursor-pointer slideshow__next border-0 text-white position-absolute top-50 d-flex align-items-center justify-content-center">
        <svg width="25" height="25" viewBox="0 0 25 25" xmlns="http://www.w3.org/2000/svg">
          <use href="#icon_next_md" />
        </svg>
      </div>

      <div className="container">
        <div className="slideshow-pagination type2 d-flex align-items-center position-absolute active-white bottom-0 left-50 mb-4"></div>
      </div>

      <div className="container">
        <div className="slideshow-social-follow d-none d-xxl-block position-absolute text-center bottom-0 mb-4">
          <ul className="social-links list-unstyled mb-0 d-flex align-items-center">
            {socialLinks.map((link, index) => (
              <li key={index}>
                <a href={link.href} className="footer__social-link d-block color-white">
                  <svg
                    className={link.className}
                    width={link.width}
                    height={link.height}
                    viewBox={link.viewBox}
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <use href={link.icon} />
                  </svg>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Swiper>
  );
}
