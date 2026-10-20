import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useContextElement } from "@/context/Context";
import { formatPrice } from "@/utlis/formatPrice";

export default function SearchPopup() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [keyword, setKeyword] = useState("");
  const containerRef = useRef(null);
  const navigate = useNavigate();
  const { catalog } = useContextElement();
  const needle = keyword.trim().toLowerCase();
  const results = needle
    ? catalog
        .filter((product) =>
          `${product.title} ${product.category}`.toLowerCase().includes(needle)
        )
        .slice(0, 6)
    : [];
  const categories = [...new Set(catalog.map((product) => product.category).filter(Boolean))].slice(0, 5);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsPopupOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const goToShop = (event) => {
    event.preventDefault();
    if (!needle) return;
    setIsPopupOpen(false);
    navigate(`/shop-1?q=${encodeURIComponent(keyword.trim())}`);
  };

  return (
    <div
      ref={containerRef}
      className={`header-tools__item hover-container ${
        isPopupOpen ? "js-content_visible" : ""
      }`}
    >
      <div className="js-hover__open position-relative">
        <a
          onClick={() => setIsPopupOpen((pre) => !pre)}
          className="js-search-popup search-field__actor"
          href="#"
        >
          <svg
            className="d-block"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <use href="#icon_search" />
          </svg>
          <i className="btn-icon btn-close-lg"></i>
        </a>
      </div>

      <div className="search-popup js-hidden-content">
        <form onSubmit={goToShop} className="search-field container">
          <p className="text-uppercase text-secondary fw-medium mb-4">
            Que recherchez-vous ?
          </p>
          <div className="position-relative">
            <input
              className="search-field__input search-popup__input w-100 fw-medium"
              type="text"
              name="search-keyword"
              placeholder="Rechercher un produit"
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
            />
            <button className="btn-icon search-popup__submit" type="submit">
              <svg
                className="d-block"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <use href="#icon_search" />
              </svg>
            </button>
            <button
              className="btn-icon btn-close-lg search-popup__reset"
              type="button"
              onClick={() => setKeyword("")}
            ></button>
          </div>

          <div className="search-popup__results">
            <div className="sub-menu search-suggestion">
              <h6 className="sub-menu__title fs-base">Catégories</h6>
              <ul className="sub-menu__list list-unstyled">
                {categories.map((name) => (
                  <li key={name} className="sub-menu__item">
                    <Link
                      to={`/shop-1?category=${encodeURIComponent(name)}`}
                      className="menu-link menu-link_us-s"
                      onClick={() => setIsPopupOpen(false)}
                    >
                      {name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="search-result">
              {results.map((product) => (
                <Link
                  key={product.id}
                  to={`/product1_simple/${product.id}`}
                  className="d-flex align-items-center gap-3 py-2 text-reset"
                  onClick={() => setIsPopupOpen(false)}
                >
                  {product.imgSrc ? (
                    <img src={product.imgSrc} alt="" width="48" height="48" />
                  ) : null}
                  <span>
                    {product.title}
                    <br />
                    <small>{formatPrice(product.price)}</small>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
