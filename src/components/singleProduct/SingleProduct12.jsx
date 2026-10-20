import { useState } from "react";
import ProductSlider1 from "./sliders/ProductSlider1";
import BreadCumb from "./BreadCumb";
import Star from "../common/Star";
import ShareComponent from "../common/ShareComponent";
import { useContextElement } from "@/context/Context";
import { formatPrice } from "@/utlis/formatPrice";
export default function SingleProduct12({ product }) {
  const { cartProducts, setCartProducts, setItemQuantity } = useContextElement();
  const [quantity, setQuantity] = useState(1);

  const isIncludeCard = () => {
    const item = cartProducts.filter((elm) => elm.id == product.id)[0];
    return item;
  };
  const cap = Math.min(20, Number.isInteger(Number(product.stock)) ? Math.max(product.stock, 0) : 20);
  const setQuantityCartItem = (id, nextQuantity) => {
    const next = Math.min(cap || 1, Math.max(1, Math.floor(Number(nextQuantity) || 1)));
    if (isIncludeCard()) setItemQuantity(id, next);
    else setQuantity(next);
  };
  const addToCart = () => {
    if (product.stock === 0 || isIncludeCard()) return;
    setCartProducts((pre) => [...pre, { ...product, quantity: Math.min(cap, quantity) || 1 }]);
  };
  return (
    <section className="product-single container">
      <div className="row">
        <div className="col-lg-7">
          <ProductSlider1 images={(product.images?.length ? product.images : [product.imgSrc]).filter(Boolean).map((imgSrc) => ({ imgSrc }))} />
        </div>
        <div className="col-lg-5">
          <div className="d-flex justify-content-between mb-4 pb-md-2">
            <div className="breadcrumb mb-0 d-none d-md-block flex-grow-1">
              <BreadCumb />
            </div>
            {/* <!-- /.breadcrumb --> */}

            <div className="product-single__prev-next d-flex align-items-center justify-content-between justify-content-md-end flex-grow-1">
              <a className="text-uppercase fw-medium">
                <svg
                  className="mb-1px"
                  width="10"
                  height="10"
                  viewBox="0 0 25 25"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <use href="#icon_prev_md" />
                </svg>
                <span className="menu-link menu-link_us-s">Précédent</span>
              </a>
              <a className="text-uppercase fw-medium">
                <span className="menu-link menu-link_us-s">Suivant</span>
                <svg
                  className="mb-1px"
                  width="10"
                  height="10"
                  viewBox="0 0 25 25"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <use href="#icon_next_md" />
                </svg>
              </a>
            </div>
            {/* <!-- /.shop-acs --> */}
          </div>
          <h1 className="product-single__name">{product.title}</h1>
          <div className="product-single__rating">
            <div className="reviews-group d-flex">
              <Star stars={5} />
            </div>
            {product.stock === 0 ? (
              <span className="reviews-note text-lowercase text-secondary ms-1">Rupture</span>
            ) : product.stock <= 5 ? (
              <span className="reviews-note text-lowercase text-secondary ms-1">
                Plus que {product.stock} en stock
              </span>
            ) : null}
          </div>
          <div className="product-single__price">
            <span className="current-price">{formatPrice(product.price)}</span>
          </div>
          <div className="product-single__short-desc">
            <p>
              {product.category
                ? `Article de la catégorie ${product.category}. Livraison en Tunisie, paiement à la livraison ou envoi de la commande sur WhatsApp.`
                : "Livraison en Tunisie, paiement à la livraison ou envoi de la commande sur WhatsApp."}
            </p>
          </div>
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="product-single__addtocart">
              <div className="qty-control position-relative">
                <input
                  type="number"
                  name="quantity"
                  value={isIncludeCard() ? isIncludeCard().quantity : quantity}
                  min="1"
                  onChange={(e) =>
                    setQuantityCartItem(product.id, e.target.value)
                  }
                  className="qty-control__number text-center"
                />
                <div
                  onClick={() =>
                    setQuantityCartItem(
                      product.id,
                      isIncludeCard()?.quantity - 1 || quantity - 1
                    )
                  }
                  className="qty-control__reduce"
                >
                  -
                </div>
                <div
                  onClick={() =>
                    setQuantityCartItem(
                      product.id,
                      isIncludeCard()?.quantity + 1 || quantity + 1
                    )
                  }
                  className="qty-control__increase"
                >
                  +
                </div>
              </div>
              {/* <!-- .qty-control --> */}
              <button
                type="submit"
                className="btn btn-primary btn-addtocart js-open-aside"
                onClick={() => addToCart()}
                disabled={product.stock === 0}
              >
                {product.stock === 0 ? "Rupture" : isIncludeCard() ? "Déjà ajouté" : "Ajouter au panier"}
              </button>
            </div>
          </form>
          <div className="product-single__addtolinks">
            <a href="#" className="menu-link menu-link_us-s add-to-wishlist">
              <svg
                width="16"
                height="16"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <use href="#icon_heart" />
              </svg>
              <span>Ajouter aux favoris</span>
            </a>
            <ShareComponent title={product.title} />
          </div>
          <div className="product-single__meta-info">
            <div className="meta-item">
              <label>Réf. :</label>
              <span>{product.id}</span>
            </div>
            <div className="meta-item">
              <label>Catégorie :</label>
              <span>{product.category || "Boutique"}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
