const countries = ["Tunisie"];
import { useContextElement } from "@/context/Context";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "@/utlis/api";
import { formatPrice } from "@/utlis/formatPrice";
import { whatsappOrderUrl } from "@/utlis/whatsapp";
export default function Checkout() {
  const { cartProducts, totalPrice, setCartProducts, shopPhone } = useContextElement();
  const [selectedRegion, setSelectedRegion] = useState("Tunisie");
  const [idDDActive, setIdDDActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [quote, setQuote] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!cartProducts.length) {
      setQuote(null);
      return;
    }
    const timer = setTimeout(() => {
      fetch(apiUrl("/api/quote"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          coupon: couponCode,
          items: cartProducts.map((item) => ({
            productId: item.id,
            title: item.title,
            price: item.price,
            quantity: item.quantity,
          })),
        }),
      })
        .then(async (response) => {
          const data = await response.json();
          setQuote(response.ok ? data : { error: data.error });
        })
        .catch(() => setQuote(null));
    }, 300);
    return () => clearTimeout(timer);
  }, [cartProducts, couponCode]);

  const placeOrder = async (event, paymentOverride) => {
    event.preventDefault();
    if (!cartProducts.length) {
      setError("Votre panier est vide.");
      return;
    }
    if (quote?.error) {
      setError(quote.error);
      return;
    }
    const form = event.currentTarget.tagName === "FORM" ? event.currentTarget : event.currentTarget.form;
    const data = new FormData(form);
    const payment = paymentOverride || data.get("payment") || "cod";
    setSending(true);
    setError("");
    try {
      const response = await fetch(apiUrl("/api/orders"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          firstName: data.get("firstName"),
          lastName: data.get("lastName"),
          phone: data.get("phone"),
          email: data.get("email"),
          address: data.get("address"),
          city: data.get("city"),
          notes: data.get("notes"),
          payment,
          coupon: couponCode,
          items: cartProducts.map((item) => ({
            productId: item.id,
            title: item.title,
            price: item.price,
            quantity: item.quantity,
          })),
        }),
      });
      const order = await response.json();
      if (!response.ok) {
        setError(order.error || "La commande n'a pas pu être enregistrée.");
        return;
      }
      if (payment === "whatsapp") {
        window.open(
          whatsappOrderUrl({
            items: order.items,
            total: order.total,
            orderNumber: order.number,
            name: order.customerName,
            phone: order.phone,
            shopPhone,
          }),
          "_blank",
          "noopener,noreferrer"
        );
      }
      setCartProducts([]);
      navigate(`/shop_order_complete?order=${order.number}`);
    } catch {
      setError("Le serveur de commandes ne répond pas. Lancez npm run api.");
    } finally {
      setSending(false);
    }
  };

  return (
    <form onSubmit={placeOrder}>
      <div className="checkout-form">
        <div className="billing-info__wrapper">
          <h4>COORDONNÉES</h4>
          <div className="row">
            <div className="col-md-6">
              <div className="form-floating my-3">
                <input
                  type="text"
                  className="form-control"
                  id="checkout_first_name"
                  name="firstName"
                  required
                  placeholder="Prénom"
                />
                <label htmlFor="checkout_first_name">Prénom</label>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-floating my-3">
                <input
                  type="text"
                  className="form-control"
                  id="checkout_last_name"
                  name="lastName"
                  required
                  placeholder="Nom"
                />
                <label htmlFor="checkout_last_name">Nom</label>
              </div>
            </div>
            <div className="col-md-12">
              <div className="form-floating my-3">
                <input
                  type="text"
                  className="form-control"
                  id="checkout_company_name"
                  placeholder="Société (facultatif)"
                />
                <label htmlFor="checkout_company_name">
                  Société (facultatif)
                </label>
              </div>
            </div>
            <div className="col-md-12">
              <div className="search-field my-3">
                <div
                  className={`form-label-fixed hover-container ${
                    idDDActive ? "js-content_visible" : ""
                  }`}
                >
                  <label htmlFor="search-dropdown" className="form-label">
                    Pays *
                  </label>
                  <div className="js-hover__open">
                    <input
                      type="text"
                      className="form-control form-control-lg search-field__actor search-field__arrow-down"
                      id="search-dropdown"
                      name="search-keyword"
                      value={selectedRegion}
                      readOnly
                      placeholder="Choisir"
                      onClick={() => setIdDDActive((pre) => !pre)}
                    />
                  </div>
                  <div className="filters-container js-hidden-content mt-2">
                    <div className="search-field__input-wrapper">
                      <input
                        type="text"
                        className="search-field__input form-control form-control-sm bg-lighter border-lighter"
                        placeholder="Rechercher"
                        onChange={(e) => {
                          setSearchQuery(e.target.value);
                        }}
                      />
                    </div>
                    <ul className="search-suggestion list-unstyled">
                      {countries
                        .filter((elm) =>
                          elm.toLowerCase().includes(searchQuery.toLowerCase())
                        )
                        .map((elm, i) => (
                          <li
                            onClick={() => {
                              setSelectedRegion(elm);
                              setIdDDActive(false);
                            }}
                            key={i}
                            className="search-suggestion__item js-search-select"
                          >
                            {elm}
                          </li>
                        ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-12">
              <div className="form-floating mt-3 mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="checkout_street_address"
                  name="address"
                  required
                  placeholder="Adresse *"
                />
                <label htmlFor="checkout_street_address">Adresse *</label>
              </div>
              <div className="form-floating mt-3 mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="checkout_street_address_2"
                />
              </div>
            </div>
            <div className="col-md-12">
              <div className="form-floating my-3">
                <input
                  type="text"
                  className="form-control"
                  id="checkout_city"
                  name="city"
                  required
                  placeholder="Ville *"
                />
                <label htmlFor="checkout_city">Ville *</label>
              </div>
            </div>
            <div className="col-md-12">
              <div className="form-floating my-3">
                <input
                  type="text"
                  className="form-control"
                  id="checkout_zipcode"
                  placeholder="Code postal"
                />
                <label htmlFor="checkout_zipcode">Code postal</label>
              </div>
            </div>
            <div className="col-md-12">
              <div className="form-floating my-3">
                <input
                  type="text"
                  className="form-control"
                  id="checkout_province"
                  placeholder="Gouvernorat"
                />
                <label htmlFor="checkout_province">Gouvernorat</label>
              </div>
            </div>
            <div className="col-md-12">
              <div className="form-floating my-3">
                <input
                  type="text"
                  className="form-control"
                  id="checkout_phone"
                  name="phone"
                  required
                  placeholder="Téléphone *"
                />
                <label htmlFor="checkout_phone">Téléphone *</label>
              </div>
            </div>
            <div className="col-md-12">
              <div className="form-floating my-3">
                <input
                  type="email"
                  className="form-control"
                  id="checkout_email"
                  name="email"
                  placeholder="E-mail"
                />
                <label htmlFor="checkout_email">E-mail</label>
              </div>
            </div>
            <div className="col-md-12">
              <div className="form-check mt-3">
                <input
                  className="form-check-input form-check-input_fill"
                  type="checkbox"
                  defaultValue=""
                  id="create_account"
                />
                <label className="form-check-label" htmlFor="create_account">
                  CRÉER UN COMPTE ?
                </label>
              </div>
              <div className="form-check mb-3">
                <input
                  className="form-check-input form-check-input_fill"
                  type="checkbox"
                  defaultValue=""
                  id="ship_different_address"
                />
                <label
                  className="form-check-label"
                  htmlFor="ship_different_address"
                >
                  LIVRER À UNE AUTRE ADRESSE ?
                </label>
              </div>
            </div>
          </div>
          <div className="col-md-12">
            <div className="mt-3">
              <textarea
                className="form-control form-control_gray"
                name="notes"
                placeholder="Note pour la commande (facultatif)"
                cols="30"
                rows="8"
              ></textarea>
            </div>
          </div>
        </div>
        <div className="checkout__totals-wrapper">
          <div className="sticky-content">
            <div className="checkout__totals">
              <h3>Votre commande</h3>
              <table className="checkout-cart-items">
                <thead>
                  <tr>
                    <th>ARTICLE</th>
                    <th>MONTANT</th>
                  </tr>
                </thead>
                <tbody>
                  {cartProducts.map((elm, i) => (
                    <tr key={i}>
                      <td>
                        {elm.title} x {elm.quantity}
                      </td>
                      <td>{formatPrice(elm.price * elm.quantity)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <table className="checkout-totals">
                <tbody>
                  <tr>
                    <th>SOUS-TOTAL</th>
                    <td>{formatPrice(quote?.subtotal ?? totalPrice)}</td>
                  </tr>
                  {quote?.discount > 0 && (
                    <tr>
                      <th>RÉDUCTION {quote.coupon}</th>
                      <td>-{formatPrice(quote.discount)}</td>
                    </tr>
                  )}
                  <tr>
                    <th>LIVRAISON</th>
                    <td>
                      {quote ? (quote.shipping ? formatPrice(quote.shipping) : "Gratuite") : "…"}
                    </td>
                  </tr>
                  <tr>
                    <th>TOTAL</th>
                    <td>{formatPrice(quote?.total ?? totalPrice)}</td>
                  </tr>
                </tbody>
              </table>
              <div className="d-flex gap-2 mt-3">
                <input
                  className="form-control"
                  placeholder="Code promo"
                  value={couponCode}
                  onChange={(event) => setCouponCode(event.target.value.toUpperCase())}
                />
              </div>
              {quote?.error && <p className="text-danger mt-2 mb-0">{quote.error}</p>}
              {quote && !quote.error && (
                <p className="text-secondary mt-2 mb-0">
                  Livraison gratuite dès {formatPrice(quote.freeFrom)}.
                </p>
              )}
            </div>
            <div className="checkout__payment-methods">
              <div className="form-check">
                <input
                  className="form-check-input form-check-input_fill"
                  type="radio"
                  name="payment"
                  id="checkout_payment_method_3"
                  value="cod"
                  defaultChecked
                />
                <label
                  className="form-check-label"
                  htmlFor="checkout_payment_method_3"
                >
                  Paiement à la livraison
                  <span className="option-detail d-block">
                    Vous payez le livreur à la réception. Le paiement par carte n’est pas encore disponible.
                  </span>
                </label>
              </div>
              <div className="policy-text">
                Vos informations servent à préparer la livraison.
              </div>
            </div>
            {error && <p className="text-danger mt-3">{error}</p>}
            <button
              className="btn btn-primary btn-checkout"
              type="submit"
              disabled={sending || !cartProducts.length}
            >
              {sending ? "Enregistrement..." : "Confirmer la commande"}
            </button>
            {cartProducts.length > 0 && (
              <button
                className="btn btn-light mt-3 d-block"
                type="button"
                disabled={sending}
                onClick={(event) => placeOrder(event, "whatsapp")}
              >
                Enregistrer et envoyer sur WhatsApp
              </button>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}
