import { useContextElement } from "@/context/Context";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import ShareComponent from "../common/ShareComponent";
import { formatPrice } from "@/utlis/formatPrice";

export default function QuickView() {
  const { quickViewItem, isAddedToCartProducts, toggleWishlist, isAddedtoWishlist, addProductToCart } = useContextElement();
  const slides = (quickViewItem?.images?.length ? quickViewItem.images : [quickViewItem?.imgSrc]).filter(Boolean);

  return (
    <div className="modal fade" id="quickView" tabIndex="-1">
      <div className="modal-dialog quick-view modal-dialog-centered">
        <div className="modal-content">
          <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Fermer"></button>
          {quickViewItem ? (
            <div className="product-single">
              <div className="product-single__media m-0">
                <div className="product-single__image position-relative w-100">
                  <Swiper
                    slidesPerView={1}
                    modules={[Navigation]}
                    navigation={{
                      nextEl: ".modal-dialog.quick-view .swiper-button-next",
                      prevEl: ".modal-dialog.quick-view .swiper-button-prev",
                    }}
                    className="swiper-container js-swiper-slider"
                  >
                    {slides.map((src, i) => (
                      <SwiperSlide key={i} className="swiper-slide product-single__image-item">
                        <img loading="lazy" width={500} height={700} style={{ width: "100%", height: "100%", objectFit: "contain" }} src={src} alt={quickViewItem.title} />
                      </SwiperSlide>
                    ))}
                    <div className="cursor-pointer swiper-button-prev"><span className="visually-hidden">Précédent</span></div>
                    <div className="cursor-pointer swiper-button-next"><span className="visually-hidden">Suivant</span></div>
                  </Swiper>
                </div>
              </div>
              <div className="product-single__detail">
                <h1 className="product-single__name">{quickViewItem.title}</h1>
                <div className="product-single__price">
                  <span className="current-price">{formatPrice(quickViewItem.price)}</span>
                </div>
                <p>{quickViewItem.category}</p>
                <p>{quickViewItem.stock === 0 ? "Rupture de stock" : `${quickViewItem.stock} en stock`}</p>
                <button
                  type="button"
                  className="btn btn-primary btn-addtocart"
                  disabled={quickViewItem.stock === 0 || isAddedToCartProducts(quickViewItem.id)}
                  onClick={() => addProductToCart(quickViewItem.id)}
                >
                  {quickViewItem.stock === 0 ? "Rupture" : isAddedToCartProducts(quickViewItem.id) ? "Déjà ajouté" : "Ajouter au panier"}
                </button>
                <div className="product-single__addtolinks mt-3">
                  <button type="button" className="btn btn-link px-0" onClick={() => toggleWishlist(quickViewItem.id)}>
                    {isAddedtoWishlist(quickViewItem.id) ? "Retirer des favoris" : "Ajouter aux favoris"}
                  </button>
                  <ShareComponent title={quickViewItem.title} />
                </div>
                <div className="product-single__meta-info mb-0">
                  <div className="meta-item">
                    <label>Réf. :</label>
                    <span>{quickViewItem.id}</span>
                  </div>
                  <div className="meta-item">
                    <label>Catégorie :</label>
                    <span>{quickViewItem.category}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
