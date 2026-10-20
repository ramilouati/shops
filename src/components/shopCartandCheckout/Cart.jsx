import { useContextElement } from "@/context/Context";
import { Link } from "react-router-dom";

import { formatPrice } from "@/utlis/formatPrice";
export default function Cart() {
  const { cartProducts, setCartProducts, totalPrice, setItemQuantity } = useContextElement();
  const removeItem = (id) => {
    setCartProducts((pre) => [...pre.filter((elm) => elm.id != id)]);
  };
  return (
    <div className="shopping-cart" style={{ minHeight: "calc(100vh - 300px)" }}>
      <div className="cart-table__wrapper">
        {cartProducts.length ? (
          <>
            <table className="cart-table">
              <thead>
                <tr>
                  <th>Article</th>
                  <th></th>
                  <th>Prix</th>
                  <th>Quantité</th>
                  <th>Sous-total</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {cartProducts.map((elm, i) => (
                  <tr key={i}>
                    <td>
                      <div className="shopping-cart__product-item">
                        <img
                          loading="lazy"
                          src={elm.imgSrc}
                          width="120"
                          height="120"
                          alt={elm.title}
                        />
                      </div>
                    </td>
                    <td>
                      <div className="shopping-cart__product-item__detail">
                        <h4>{elm.title}</h4>
                        <p className="mb-0">{elm.category}</p>
                      </div>
                    </td>
                    <td>
                      <span className="shopping-cart__product-price">
                        {formatPrice(elm.price)}
                      </span>
                    </td>
                    <td>
                      <div className="qty-control position-relative">
                        <input
                          type="number"
                          name="quantity"
                          value={elm.quantity}
                          min={1}
                          onChange={(e) =>
                            setItemQuantity(elm.id, e.target.value / 1)
                          }
                          className="qty-control__number text-center"
                        />
                        <div
                          onClick={() => setItemQuantity(elm.id, elm.quantity - 1)}
                          className="qty-control__reduce"
                        >
                          -
                        </div>
                        <div
                          onClick={() => setItemQuantity(elm.id, elm.quantity + 1)}
                          className="qty-control__increase"
                        >
                          +
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="shopping-cart__subtotal">
                        {formatPrice(elm.price * elm.quantity)}
                      </span>
                    </td>
                    <td>
                      <a
                        onClick={() => removeItem(elm.id)}
                        className="remove-cart"
                      >
                        <svg
                          width="10"
                          height="10"
                          viewBox="0 0 10 10"
                          fill="#767676"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M0.259435 8.85506L9.11449 0L10 0.885506L1.14494 9.74056L0.259435 8.85506Z" />
                          <path d="M0.885506 0.0889838L9.74057 8.94404L8.85506 9.82955L0 0.97449L0.885506 0.0889838Z" />
                        </svg>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        ) : (
          <>
            <div className="fs-20">Votre panier est vide.</div>

            <Link to="/shop-1" className="btn mt-3 btn-light">
              Voir la boutique
            </Link>
          </>
        )}
      </div>
      {cartProducts.length ? (
        <div className="shopping-cart__totals-wrapper">
          <div className="sticky-content">
            <div className="shopping-cart__totals">
              <h3>Total</h3>
              <table className="cart-totals">
                <tbody>
                  <tr>
                    <th>Sous-total</th>
                    <td>{formatPrice(totalPrice)}</td>
                  </tr>
                  <tr>
                    <th>Livraison</th>
                    <td>Calculée à l’étape suivante</td>
                  </tr>
                  <tr>
                    <th>Total</th>
                    <td>{formatPrice(totalPrice)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mobile_fixed-btn_wrapper">
              <div className="button-wrapper container">
                <Link to="/shop_checkout" className="btn btn-primary btn-checkout">
                  Commander
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
