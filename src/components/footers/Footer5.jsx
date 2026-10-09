/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";

import { currencyOptions, languageOptions, socialLinks } from "@/data/footer";
import {
  footerCompanyLinks,
  footerHelpLinks,
  footerShopLinks,
} from "@/data/home5";

export default function Footer5({ parentClass }) {
  return (
    <footer className={parentClass}>
      <div className="footer-middle container">
        <div className="row row-cols-lg-5 row-cols-2">
          <div className="footer-column footer-store-info col-12 mb-4 mb-lg-0">
            <div className="logo">
              <Link to="/">
                <img
                  src="/assets/images/logo-white.png"
                  alt="Uomo"
                  width={112}
                  height={28}
                  className="logo__image"
                />
              </Link>
            </div>
            {/* <!-- /.logo --> */}
            <p className="footer-address">
              Avenue Habib Bourguiba, 1000 Tunis, Tunisie
            </p>

            <p className="m-0">
              <strong className="fw-medium">sale@uomo.com</strong>
            </p>
            <p>
              <strong className="fw-medium">+216 70 000 000</strong>
            </p>

            <ul className="social-links list-unstyled d-flex flex-wrap mb-0">
              {socialLinks.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="footer__social-link d-block">
                    <svg
                      className={link.className}
                      width={link.width}
                      height={link.height}
                      viewBox={link.viewBox}
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      {typeof link.icon === "string" ? (
                        <use href={link.icon} />
                      ) : (
                        link.icon
                      )}
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          {/* <!-- /.footer-column --> */}

          <div className="footer-column footer-menu mb-4 mb-lg-0">
            <h6 className="sub-menu__title text-uppercase">Société</h6>
            <ul className="sub-menu__list list-unstyled">
              {footerCompanyLinks.map((elm, i) => (
                <li key={i} className="sub-menu__item">
                  <Link to={elm.href} className="menu-link menu-link_us-s">
                    {elm.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          {/* <!-- /.footer-column --> */}

          <div className="footer-column footer-menu mb-4 mb-lg-0">
            <h6 className="sub-menu__title text-uppercase">Boutique</h6>
            <ul className="sub-menu__list list-unstyled">
              {footerShopLinks.map((elm, i) => (
                <li key={i} className="sub-menu__item">
                  <Link to={elm.href} className="menu-link menu-link_us-s">
                    {elm.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          {/* <!-- /.footer-column --> */}

          <div className="footer-column footer-menu mb-4 mb-lg-0">
            <h6 className="sub-menu__title text-uppercase">Aide</h6>
            <ul className="sub-menu__list list-unstyled">
              {footerHelpLinks.map((elm, i) => (
                <li key={i} className="sub-menu__item">
                  <Link to={elm.href} className="menu-link menu-link_us-s">
                    {elm.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          {/* <!-- /.footer-column --> */}

          <div className="footer-column mb-4 mb-lg-0">
            <h6 className="sub-menu__title text-uppercase">Horaires d’ouverture</h6>
            <ul className="list-unstyled">
              <li>
                <span className="menu-link">Lun - Ven : 8h - 21h</span>
              </li>
              <li>
                <span className="menu-link">Sam : 9h - 20h</span>
              </li>
              <li>
                <span className="menu-link">Dim : Fermé</span>
              </li>
            </ul>
          </div>
          {/* <!-- /.footer-column --> */}
        </div>
        {/* <!-- /.row-cols-5 --> */}
      </div>
      {/* <!-- /.footer-middle container --> */}

      <div className="footer-bottom">
        <div className="container d-md-flex align-items-center">
          <span className="footer-copyright me-auto">
            ©{new Date().getFullYear()} Uomo
          </span>
          <div className="footer-settings d-md-flex align-items-center">
            <select
              id="footerSettingsLanguage"
              className="form-select form-select-sm bg-transparent border-0"
              aria-label="Langue"
              name="store-language"
            >
              {languageOptions.map((option, index) => (
                <option
                  key={index}
                  className="footer-select__option"
                  value={option.value}
                >
                  {option.text}
                </option>
              ))}
            </select>

            <select
              id="footerSettingsCurrency"
              className="form-select form-select-sm bg-transparent border-0"
              aria-label="Devise"
              name="store-currency"
            >
              {currencyOptions.map((option, index) => (
                <option
                  key={index}
                  className="footer-select__option"
                  value={option.value}
                >
                  {option.text}
                </option>
              ))}
            </select>
          </div>
          {/* <!-- /.footer-settings --> */}
        </div>
        {/* <!-- /.container d-flex align-items-center --> */}
      </div>
      {/* <!-- /.footer-bottom container --> */}
    </footer>
  );
}
