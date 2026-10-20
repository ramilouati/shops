import { Link } from "react-router-dom";

import { useEffect, useState } from "react";
import Nav from "./components/Nav";
import { openCart } from "@/utlis/openCart";
import CartLength from "./components/CartLength";

import SearchPopup from "./components/SearchPopup";
import { openModalUserlogin } from "@/utlis/aside";
import { useContextElement } from "@/context/Context";

export default function Header5({ solid = false }) {
  const { customer } = useContextElement();
  const [scrollDirection, setScrollDirection] = useState("down");

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > 250) {
        if (currentScrollY > lastScrollY.current) {
          // Scrolling down
          setScrollDirection("down");
        } else {
          // Scrolling up
          setScrollDirection("up");
        }
      } else {
        // Below 250px
        setScrollDirection("down");
      }

      lastScrollY.current = currentScrollY;
    };

    const lastScrollY = { current: window.scrollY };

    // Add scroll event listener
    window.addEventListener("scroll", handleScroll);

    // Cleanup: remove event listener when component unmounts
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return (
    <header
      id="header"
      className={`header header_sticky ${
        solid
          ? "header_sticky-active"
          : `header-transparent-bg header_sticky-bg_dark ${
              scrollDirection == "up" ? "header_sticky-active" : "position-absolute"
            }`
      }`}
    >
      <div className="container">
        <div className="header-desk header-desk_type_3">
          <div className="logo">
            <Link to="/">
              <img
                src={solid ? "/assets/images/logo-tunishop.svg" : "/assets/images/logo-tunishop-white.svg"}
                width={112}
                height={28}
                alt="TuniShop"
                className="logo__image d-block"
              />
            </Link>
          </div>
          {/* <!-- /.logo --> */}

          <nav className="navigation">
            <ul className="navigation__list list-unstyled d-flex">
              <Nav />
            </ul>
          </nav>
          {/* <!-- /.navigation --> */}

          <div className="header-tools d-flex align-items-center">
            <SearchPopup />

            {customer ? (
              <Link className="header-tools__item" to="/compte" title={customer.name}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <use href="#icon_user" />
                </svg>
              </Link>
            ) : (
              <a
                className="header-tools__item js-open-aside"
                href="#"
                onClick={(event) => {
                  event.preventDefault();
                  openModalUserlogin();
                }}
                title="Connexion"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <use href="#icon_user" />
                </svg>
              </a>
            )}

            <Link className="header-tools__item" to="/account_wishlist">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <use href="#icon_heart" />
              </svg>
            </Link>

            <a
              onClick={() => openCart()}
              className="header-tools__item header-tools__cart js-open-aside"
            >
              <svg
                className="d-block"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <use href="#icon_cart" />
              </svg>
              <span className="cart-amount d-block position-absolute js-cart-items-count">
                <CartLength />
              </span>
            </a>
          </div>
          {/* <!-- /.header__tools --> */}
        </div>
        {/* <!-- /.header-desk header-desk_type_3 --> */}
      </div>
    </header>
  );
}
