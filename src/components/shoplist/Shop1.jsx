import { products51 } from "@/data/products/fashion";
import { Swiper, SwiperSlide } from "swiper/react";
import Star from "../common/Star";
import ColorSelection from "../common/ColorSelection";
import { Navigation } from "swiper/modules";
import Pagination1 from "../common/Pagination1";
import { useEffect, useState } from "react";
import BreadCumb from "./BreadCumb";
import { Link } from "react-router-dom";
import { useContextElement } from "@/context/Context";
const itemPerRow = [2, 3, 4];

import { openModalShopFilter } from "@/utlis/aside";
import { formatPrice } from "@/utlis/formatPrice";
export default function Shop1() {
  const { toggleWishlist, isAddedtoWishlist, catalog } = useContextElement();
  const [selectedColView, setSelectedColView] = useState(4);

  const { addProductToCart, isAddedToCartProducts } = useContextElement();
  const shopProducts = catalog.length ? catalog : products51;
  const categories = [
    "Tout",
    ...new Set(shopProducts.map((product) => product.category).filter(Boolean)),
  ];
  const [currentCategory, setCurrentCategory] = useState("Tout");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("default");

  const [filtered, setFiltered] = useState(shopProducts);
  useEffect(() => {
    let list = shopProducts.filter((elm) => {
      const inCategory =
        currentCategory == "Tout" ||
        currentCategory == "All" ||
        elm.category == currentCategory ||
        elm.filterCategory2 == currentCategory;
      const inSearch = elm.title?.toLowerCase().includes(query.trim().toLowerCase());
      return inCategory && inSearch;
    });
    if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "name") list = [...list].sort((a, b) => a.title.localeCompare(b.title, "fr"));
    setFiltered(list);
  }, [currentCategory, shopProducts, query, sort]);

  return (
    <>
      <section className="full-width_padding">
        <div
          className="full-width_border border-2"
          style={{ borderColor: "#eeeeee" }}
        >
          <div className="shop-banner position-relative">
            <div
              className="background-img"
              style={{ backgroundColor: "#eeeeee" }}
            >
              <img
                loading="lazy"
                src="/assets/images/shop/shop_banner_character1.png"
                width="1759"
                height="420"
                alt="Pattern"
                className="slideshow-bg__img object-fit-cover"
              />
            </div>

            <div className="shop-banner__content container position-absolute start-50 top-50 translate-middle">
              <h2 className="stroke-text h1 smooth-16 text-uppercase fw-bold mb-3 mb-xl-4 mb-xl-5">
                Boutique
              </h2>
              <ul className="d-flex flex-wrap list-unstyled text-uppercase h6">
                {categories.map((elm, i) => (
                  <li key={i} className="me-3 me-xl-4 pe-1">
                    <a
                      onClick={() => setCurrentCategory(elm)}
                      className={`menu-link menu-link_us-s ${
                        currentCategory == elm ? "menu-link_active" : ""
                      }`}
                    >
                      {elm}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            {/* <!-- /.shop-banner__content --> */}
          </div>
          {/* <!-- /.shop-banner position-relative --> */}
        </div>
        {/* <!-- /.full-width_border --> */}
      </section>
      <div className="mb-4 pb-lg-3"></div>
      <section className="shop-main container">
        <div className="d-flex justify-content-between mb-4 pb-md-2">
          <div className="breadcrumb mb-0 d-none d-md-block flex-grow-1">
            <BreadCumb />
          </div>

          <div className="shop-acs d-flex align-items-center justify-content-between justify-content-md-end flex-grow-1">
            <input
              className="form-control w-auto"
              type="search"
              placeholder="Rechercher"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              aria-label="Rechercher un article"
            />
            <select
              className="shop-acs__select form-select w-auto border-0 py-0 order-1 order-md-0"
              aria-label="Trier"
              value={sort}
              onChange={(event) => setSort(event.target.value)}
            >
              <option value="default">Tri par défaut</option>
              <option value="price-asc">Prix croissant</option>
              <option value="price-desc">Prix décroissant</option>
              <option value="name">Nom, A-Z</option>
            </select>

            <div className="shop-asc__seprator mx-3 bg-light d-none d-md-block order-md-0"></div>

            <div className="col-size align-items-center order-1 d-none d-lg-flex">
              <span className="text-uppercase fw-medium me-2">View</span>
              {itemPerRow.map((elm, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedColView(elm)}
                  className={`btn-link fw-medium me-2 js-cols-size ${
                    selectedColView == elm ? "btn-link_active" : ""
                  } `}
                >
                  {elm}
                </button>
              ))}
            </div>
            {/* <!-- /.col-size --> */}

            <div className="shop-asc__seprator mx-3 bg-light d-none d-lg-block order-md-1"></div>

            <div className="shop-filter d-flex align-items-center order-0 order-md-3">
              <button
                className="btn-link btn-link_f d-flex align-items-center ps-0 js-open-aside"
                onClick={openModalShopFilter}
              >
                <svg
                  className="d-inline-block align-middle me-2"
                  width="14"
                  height="10"
                  viewBox="0 0 14 10"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <use href="#icon_filter" />
                </svg>
                <span className="text-uppercase fw-medium d-inline-block align-middle">
                  Filter
                </span>
              </button>
            </div>
            {/* <!-- /.col-size d-flex align-items-center ms-auto ms-md-3 --> */}
          </div>
          {/* <!-- /.shop-acs --> */}
        </div>
        {/* <!-- /.d-flex justify-content-between --> */}

        <div
          className={`products-grid row row-cols-2 row-cols-md-3 row-cols-lg-${selectedColView}`}
          id="products-grid"
        >
          {filtered.map((elm, i) => (
            <div key={i} className="product-card-wrapper">
              <div className="product-card mb-3 mb-md-4 mb-xxl-5">
                <div className="pc__img-wrapper">
                  <Swiper
                    className="shop-list-swiper   swiper-container swiper-initialized swiper-horizontal swiper-backface-hidden background-img js-swiper-slider"
                    slidesPerView={1}
                    modules={[Navigation]}
                    navigation={{
                      prevEl: ".prev" + i,
                      nextEl: ".next" + i,
                    }}
                  >
                    {[elm.imgSrc, elm.imgSrc2].filter(Boolean).map((elm2, i) => (
                      <SwiperSlide key={i} className="swiper-slide">
                        <Link to={`/product1_simple/${elm.id}`}>
                          <img
                            loading="lazy"
                            src={elm2}
                            width="330"
                            height="400"
                            alt="Cropped Faux leather Jacket"
                            className="pc__img"
                          />
                        </Link>
                      </SwiperSlide>
                    ))}

                    <span
                      className={`cursor-pointer pc__img-prev ${"prev" + i} `}
                    >
                      <svg
                        width="7"
                        height="11"
                        viewBox="0 0 7 11"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <use href="#icon_prev_sm" />
                      </svg>
                    </span>
                    <span
                      className={`cursor-pointer pc__img-next ${"next" + i} `}
                    >
                      <svg
                        width="7"
                        height="11"
                        viewBox="0 0 7 11"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <use href="#icon_next_sm" />
                      </svg>
                    </span>
                  </Swiper>
                  {elm.stock === 0 ? (
                    <button
                      className="pc__atc btn anim_appear-bottom btn position-absolute border-0 text-uppercase fw-medium"
                      disabled
                    >
                      Rupture
                    </button>
                  ) : (
                    <button
                      className="pc__atc btn anim_appear-bottom btn position-absolute border-0 text-uppercase fw-medium js-add-cart js-open-aside"
                      onClick={() => addProductToCart(elm.id)}
                      title={
                        isAddedToCartProducts(elm.id)
                          ? "Déjà ajouté"
                          : "Ajouter au panier"
                      }
                    >
                      {isAddedToCartProducts(elm.id)
                        ? "Déjà ajouté"
                        : "Ajouter au panier"}
                    </button>
                  )}
                </div>

                <div className="pc__info position-relative">
                  <p className="pc__category">{elm.category}</p>
                  {elm.stock > 0 && elm.stock <= 5 && (
                    <p className="text-danger mb-1">Plus que {elm.stock} en stock</p>
                  )}
                  <h6 className="pc__title">
                    <Link to={`/product1_simple/${elm.id}`}>{elm.title}</Link>
                  </h6>
                  <div className="product-card__price d-flex">
                    {elm.priceOld ? (
                      <>
                        {" "}
                        <span className="money price price-old">
                          {formatPrice(elm.priceOld)}
                        </span>
                        <span className="money price price-sale">
                          {formatPrice(elm.price)}
                        </span>
                      </>
                    ) : (
                      <span className="money price">{formatPrice(elm.price)}</span>
                    )}
                  </div>
                  {elm.colors && (
                    <div className="d-flex align-items-center mt-1">
                      {" "}
                      <ColorSelection />{" "}
                    </div>
                  )}
                  {elm.reviews && (
                    <div className="product-card__review d-flex align-items-center">
                      <div className="reviews-group d-flex">
                        <Star stars={elm.rating} />
                      </div>
                      <span className="reviews-note text-lowercase text-secondary ms-1">
                        {elm.reviews}
                      </span>
                    </div>
                  )}

                  <button
                    className={`pc__btn-wl position-absolute top-0 end-0 bg-transparent border-0 js-add-wishlist ${
                      isAddedtoWishlist(elm.id) ? "active" : ""
                    }`}
                    onClick={() => toggleWishlist(elm.id)}
                    title="Add To Wishlist"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <use href="#icon_heart" />
                    </svg>
                  </button>
                </div>
                {elm.discont && (
                  <div className="pc-labels position-absolute top-0 start-0 w-100 d-flex justify-content-between">
                    <div className="pc-labels__right ms-auto">
                      <span className="pc-label pc-label_sale d-block text-white">
                        -{elm.discont}%
                      </span>
                    </div>
                  </div>
                )}
                {elm.isNew && (
                  <div className="pc-labels position-absolute top-0 start-0 w-100 d-flex justify-content-between">
                    <div className="pc-labels__left">
                      <span className="pc-label pc-label_new d-block bg-white">
                        NEW
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        {/* <!-- /.products-grid row --> */}

        <p className="mb-5 text-center fw-medium">SHOWING 36 of 497 items</p>
        <Pagination1 />

        <div className="text-center">
          <a className="btn-link btn-link_lg text-uppercase fw-medium" href="#">
            Show More
          </a>
        </div>
      </section>
    </>
  );
}
