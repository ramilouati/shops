import { Link } from "react-router-dom";

export default function SiteMap() {
  return (
    <div className="modal fade" id="siteMap" tabIndex="-1">
      <div className="modal-dialog modal-fullscreen">
        <div className="sitemap d-flex">
          <div className="w-50 d-none d-lg-block">
            <img
              width={960}
              height={950}
              style={{ height: "fit-content" }}
              loading="lazy"
              src="/assets/images/nav-bg.jpg"
              alt="Menu"
              className="sitemap__bg"
            />
          </div>
          {/* <!-- /.sitemap__bg w-50 d-none d-lg-block --> */}
          <div className="sitemap__links w-50 flex-grow-1">
            <div className="modal-content">
              <div className="modal-header">
                <ul className="nav nav-pills" id="pills-tab" role="tablist">
                  <li className="nav-item" role="presentation">
                    <a
                      className="nav-link active rounded-1 text-uppercase"
                      id="pills-item-1-tab"
                      data-bs-toggle="pill"
                      href="#pills-item-1"
                      role="tab"
                      aria-controls="pills-item-1"
                      aria-selected="true"
                    >
                      FEMME
                    </a>
                  </li>
                  <li className="nav-item" role="presentation">
                    <a
                      className="nav-link rounded-1 text-uppercase"
                      id="pills-item-2-tab"
                      data-bs-toggle="pill"
                      href="#pills-item-2"
                      role="tab"
                      aria-controls="pills-item-2"
                      aria-selected="false"
                    >
                      HOMME
                    </a>
                  </li>
                  <li className="nav-item" role="presentation">
                    <a
                      className="nav-link rounded-1 text-uppercase"
                      id="pills-item-3-tab"
                      data-bs-toggle="pill"
                      href="#pills-item-3"
                      role="tab"
                      aria-controls="pills-item-3"
                      aria-selected="false"
                    >
                      ENFANT
                    </a>
                  </li>
                </ul>
                <button
                  type="button"
                  className="btn-close-lg"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>

              <div className="modal-body">
                <div className="tab-content col-12" id="pills-tabContent">
                  <div
                    className="tab-pane fade show active"
                    id="pills-item-1"
                    role="tabpanel"
                    aria-labelledby="pills-item-1-tab"
                  >
                    <div className="row">
                      <ul
                        className="nav nav-tabs list-unstyled col-5 d-block"
                        id="myTab"
                        role="tablist"
                      >
                        <li
                          className="nav-item position-relative"
                          role="presentation"
                        >
                          <a
                            className="nav-link nav-link_rline active"
                            id="tab-item-1-tab"
                            data-bs-toggle="tab"
                            href="#tab-item-1"
                            role="tab"
                            aria-controls="tab-item-1"
                            aria-selected="true"
                          >
                            <span className="rline-content">FEMME</span>
                          </a>
                        </li>
                        <li
                          className="nav-item position-relative"
                          role="presentation"
                        >
                          <a
                            className="nav-link nav-link_rline"
                            id="tab-item-2-tab"
                            data-bs-toggle="tab"
                            href="#tab-item-2"
                            role="tab"
                            aria-controls="tab-item-2"
                            aria-selected="false"
                          >
                            <span className="rline-content">HOMME</span>
                          </a>
                        </li>
                        <li
                          className="nav-item position-relative"
                          role="presentation"
                        >
                          <a
                            className="nav-link nav-link_rline"
                            id="tab-item-3-tab"
                            data-bs-toggle="tab"
                            href="#tab-item-3"
                            role="tab"
                            aria-controls="tab-item-3"
                            aria-selected="false"
                          >
                            <span className="rline-content">ENFANT</span>
                          </a>
                        </li>
                        <li
                          className="nav-item position-relative"
                          role="presentation"
                        >
                          <a className="nav-link nav-link_rline" href="#">
                            <span className="rline-content">MAISON</span>
                          </a>
                        </li>
                        <li
                          className="nav-item position-relative"
                          role="presentation"
                        >
                          <a className="nav-link nav-link_rline" href="#">
                            <span className="rline-content">COLLECTION</span>
                          </a>
                        </li>
                        <li
                          className="nav-item position-relative"
                          role="presentation"
                        >
                          <a
                            className="nav-link nav-link_rline text-red"
                            href="#"
                          >
                            SOLDES JUSQU’À -50 %
                          </a>
                        </li>
                        <li
                          className="nav-item position-relative"
                          role="presentation"
                        >
                          <a className="nav-link nav-link_rline" href="#">
                            <span className="rline-content">NOUVEAUTÉS</span>
                          </a>
                        </li>
                        <li
                          className="nav-item position-relative"
                          role="presentation"
                        >
                          <a className="nav-link nav-link_rline" href="#">
                            <span className="rline-content">CHAUSSURES</span>
                          </a>
                        </li>
                        <li
                          className="nav-item position-relative"
                          role="presentation"
                        >
                          <a className="nav-link nav-link_rline" href="#">
                            <span className="rline-content">ACCESSOIRES</span>
                          </a>
                        </li>
                        <li
                          className="nav-item position-relative"
                          role="presentation"
                        >
                          <a className="nav-link nav-link_rline" href="#">
                            <span className="rline-content">MODE RESPONSABLE</span>
                          </a>
                        </li>
                        <li
                          className="nav-item position-relative"
                          role="presentation"
                        >
                          <a className="nav-link nav-link_rline" href="#">
                            <span className="rline-content">#UOMOSTYLE</span>
                          </a>
                        </li>
                      </ul>

                      <div className="tab-content col-7" id="myTabContent">
                        <div
                          className="tab-pane fade show active"
                          id="tab-item-1"
                          role="tabpanel"
                          aria-labelledby="tab-item-1-tab"
                        >
                          <ul className="sub-menu list-unstyled">
                            <li className="sub-menu__item">
                              <a href="#" className="menu-link menu-link_us-s">
                                Nouveautés
                              </a>
                            </li>
                            <li className="sub-menu__item">
                              <a href="#" className="menu-link menu-link_us-s">
                                Meilleures ventes
                              </a>
                            </li>
                            <li className="sub-menu__item">
                              <a href="#" className="menu-link menu-link_us-s">
                                Collaborations®
                              </a>
                            </li>
                            <li className="sub-menu__item">
                              <a href="#" className="menu-link menu-link_us-s">
                                Ensembles
                              </a>
                            </li>
                            <li className="sub-menu__item">
                              <a href="#" className="menu-link menu-link_us-s">
                                Denim
                              </a>
                            </li>
                            <li className="sub-menu__item">
                              <a href="#" className="menu-link menu-link_us-s">
                                Vestes et manteaux
                              </a>
                            </li>
                            <li className="sub-menu__item">
                              <a href="#" className="menu-link menu-link_us-s">
                                Surchemises
                              </a>
                            </li>
                            <li className="sub-menu__item">
                              <a href="#" className="menu-link menu-link_us-s">
                                Pantalons
                              </a>
                            </li>
                            <li className="sub-menu__item">
                              <a href="#" className="menu-link menu-link_us-s">
                                Jeans
                              </a>
                            </li>
                            <li className="sub-menu__item">
                              <a href="#" className="menu-link menu-link_us-s">
                                Robes
                              </a>
                            </li>
                            <li className="sub-menu__item">
                              <a href="#" className="menu-link menu-link_us-s">
                                Sweats et hoodies
                              </a>
                            </li>
                            <li className="sub-menu__item">
                              <a href="#" className="menu-link menu-link_us-s">
                                T-shirts et tops
                              </a>
                            </li>
                            <li className="sub-menu__item">
                              <a href="#" className="menu-link menu-link_us-s">
                                Chemises et blouses
                              </a>
                            </li>
                            <li className="sub-menu__item">
                              <a href="#" className="menu-link menu-link_us-s">
                                Shorts et bermudas
                              </a>
                            </li>
                            <li className="sub-menu__item">
                              <a href="#" className="menu-link menu-link_us-s">
                                Chaussures
                              </a>
                            </li>
                            <li className="sub-menu__item">
                              <Link
                                to="/shop3"
                                className="menu-link menu-link_us-s"
                              >
                                Accessoires
                              </Link>
                            </li>
                            <li className="sub-menu__item">
                              <a href="#" className="menu-link menu-link_us-s">
                                Sacs
                              </a>
                            </li>
                            <li className="sub-menu__item">
                              <Link
                                to="/about"
                                className="menu-link menu-link_us-s"
                              >
                                Carte cadeau
                              </Link>
                            </li>
                          </ul>
                          {/* <!-- /.sub-menu --> */}
                        </div>
                        <div
                          className="tab-pane fade"
                          id="tab-item-2"
                          role="tabpanel"
                          aria-labelledby="tab-item-2-tab"
                        >
                          <ul className="sub-menu list-unstyled">
                            <li className="sub-menu__item">
                              <a href="#" className="menu-link menu-link_us-s">
                                Meilleures ventes
                              </a>
                            </li>
                            <li className="sub-menu__item">
                              <a href="#" className="menu-link menu-link_us-s">
                                Nouveautés
                              </a>
                            </li>
                            <li className="sub-menu__item">
                              <a href="#" className="menu-link menu-link_us-s">
                                Ensembles
                              </a>
                            </li>
                            <li className="sub-menu__item">
                              <a href="#" className="menu-link menu-link_us-s">
                                Denim
                              </a>
                            </li>
                            <li className="sub-menu__item">
                              <a href="#" className="menu-link menu-link_us-s">
                                Collaborations®
                              </a>
                            </li>
                            <li className="sub-menu__item">
                              <a href="#" className="menu-link menu-link_us-s">
                                Pantalons
                              </a>
                            </li>
                            <li className="sub-menu__item">
                              <a href="#" className="menu-link menu-link_us-s">
                                Vestes et manteaux
                              </a>
                            </li>
                            <li className="sub-menu__item">
                              <a href="#" className="menu-link menu-link_us-s">
                                Surchemises
                              </a>
                            </li>
                            <li className="sub-menu__item">
                              <a href="#" className="menu-link menu-link_us-s">
                                Robes
                              </a>
                            </li>
                            <li className="sub-menu__item">
                              <a href="#" className="menu-link menu-link_us-s">
                                Jeans
                              </a>
                            </li>
                            <li className="sub-menu__item">
                              <a href="#" className="menu-link menu-link_us-s">
                                Sweats et hoodies
                              </a>
                            </li>
                            <li className="sub-menu__item">
                              <Link
                                to="/about"
                                className="menu-link menu-link_us-s"
                              >
                                Carte cadeau
                              </Link>
                            </li>
                            <li className="sub-menu__item">
                              <a href="#" className="menu-link menu-link_us-s">
                                Chemises et blouses
                              </a>
                            </li>
                            <li className="sub-menu__item">
                              <a href="#" className="menu-link menu-link_us-s">
                                T-shirts et tops
                              </a>
                            </li>
                            <li className="sub-menu__item">
                              <a href="#" className="menu-link menu-link_us-s">
                                Shorts et bermudas
                              </a>
                            </li>
                            <li className="sub-menu__item">
                              <Link
                                to="/shop3"
                                className="menu-link menu-link_us-s"
                              >
                                Accessoires
                              </Link>
                            </li>
                            <li className="sub-menu__item">
                              <a href="#" className="menu-link menu-link_us-s">
                                Chaussures
                              </a>
                            </li>
                            <li className="sub-menu__item">
                              <a href="#" className="menu-link menu-link_us-s">
                                Sacs
                              </a>
                            </li>
                          </ul>
                          {/* <!-- /.sub-menu --> */}
                        </div>
                        <div
                          className="tab-pane fade"
                          id="tab-item-3"
                          role="tabpanel"
                          aria-labelledby="tab-item-3-tab"
                        >
                          <ul className="sub-menu list-unstyled">
                            <li className="sub-menu__item">
                              <Link
                                to="/about"
                                className="menu-link menu-link_us-s"
                              >
                                Carte cadeau
                              </Link>
                            </li>
                            <li className="sub-menu__item">
                              <a href="#" className="menu-link menu-link_us-s">
                                Collaborations®
                              </a>
                            </li>
                            <li className="sub-menu__item">
                              <a href="#" className="menu-link menu-link_us-s">
                                Ensembles
                              </a>
                            </li>
                            <li className="sub-menu__item">
                              <a href="#" className="menu-link menu-link_us-s">
                                Denim
                              </a>
                            </li>
                            <li className="sub-menu__item">
                              <a href="#" className="menu-link menu-link_us-s">
                                Nouveautés
                              </a>
                            </li>
                            <li className="sub-menu__item">
                              <a href="#" className="menu-link menu-link_us-s">
                                Meilleures ventes
                              </a>
                            </li>
                            <li className="sub-menu__item">
                              <a href="#" className="menu-link menu-link_us-s">
                                Surchemises
                              </a>
                            </li>
                            <li className="sub-menu__item">
                              <a href="#" className="menu-link menu-link_us-s">
                                Vestes et manteaux
                              </a>
                            </li>
                            <li className="sub-menu__item">
                              <a href="#" className="menu-link menu-link_us-s">
                                Jeans
                              </a>
                            </li>
                            <li className="sub-menu__item">
                              <a href="#" className="menu-link menu-link_us-s">
                                Pantalons
                              </a>
                            </li>
                            <li className="sub-menu__item">
                              <a href="#" className="menu-link menu-link_us-s">
                                Shorts et bermudas
                              </a>
                            </li>
                            <li className="sub-menu__item">
                              <a href="#" className="menu-link menu-link_us-s">
                                Chaussures
                              </a>
                            </li>
                            <li className="sub-menu__item">
                              <Link
                                to="/shop3"
                                className="menu-link menu-link_us-s"
                              >
                                Accessoires
                              </Link>
                            </li>
                            <li className="sub-menu__item">
                              <a href="#" className="menu-link menu-link_us-s">
                                Robes
                              </a>
                            </li>
                            <li className="sub-menu__item">
                              <a href="#" className="menu-link menu-link_us-s">
                                Sacs
                              </a>
                            </li>
                          </ul>
                          {/* <!-- /.sub-menu --> */}
                        </div>
                      </div>
                    </div>
                    {/* <!-- /.row --> */}
                  </div>
                  <div
                    className="tab-pane fade"
                    id="pills-item-2"
                    role="tabpanel"
                    aria-labelledby="pills-item-2-tab"
                  >
                    <p>
                      Découvrez notre collection Homme : des pièces modernes et
                      intemporelles pour toutes les occasions.
                    </p>
                  </div>
                  <div
                    className="tab-pane fade"
                    id="pills-item-3"
                    role="tabpanel"
                    aria-labelledby="pills-item-3-tab"
                  >
                    <p>
                      Découvrez notre collection Enfant : confort et style pour
                      les plus petits.
                    </p>
                  </div>
                </div>
              </div>
              {/* <!-- /.modal-body --> */}
            </div>
            {/* <!-- /.modal-content --> */}
          </div>
          {/* <!-- /.sitemap__links w-50 flex-grow-1 --> */}
        </div>
      </div>
      {/* <!-- /.modal-dialog modal-fullscreen --> */}
    </div>
  );
}
