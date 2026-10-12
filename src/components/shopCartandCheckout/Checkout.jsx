const countries = ["Tunisie"];
import { useContextElement } from "@/context/Context";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { formatPrice } from "@/utlis/formatPrice";
import { whatsappOrderUrl } from "@/utlis/whatsapp";
export default function Checkout() {
  const { cartProducts, totalPrice, setCartProducts } = useContextElement();
  const [selectedRegion, setSelectedRegion] = useState("Tunisie");
  const [idDDActive, setIdDDActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const navigate = useNavigate();

  const placeOrder = async (event) => {
    event.preventDefault();
    if (!cartProducts.length) {
      setError("Votre panier est vide.");
      return;
    }
    const data = new FormData(event.currentTarget);
    setSending(true);
    setError("");
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: data.get("firstName"),
          lastName: data.get("lastName"),
          phone: data.get("phone"),
          email: data.get("email"),
          address: data.get("address"),
          city: data.get("city"),
          notes: data.get("notes"),
          payment: data.get("payment") || "cod",
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
          <h4>BILLING DETAILS</h4>
          <div className="row">
            <div className="col-md-6">
              <div className="form-floating my-3">
                <input
                  type="text"
                  className="form-control"
                  id="checkout_first_name"
                  name="firstName"
                  required
                  placeholder="First Name"
                />
                <label htmlFor="checkout_first_name">First Name</label>
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
                  placeholder="Last Name"
                />
                <label htmlFor="checkout_last_name">Last Name</label>
              </div>
            </div>
            <div className="col-md-12">
              <div className="form-floating my-3">
                <input
                  type="text"
                  className="form-control"
                  id="checkout_company_name"
                  placeholder="Company Name (optional)"
                />
                <label htmlFor="checkout_company_name">
                  Company Name (optional)
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
                    Country / Region*
                  </label>
                  <div className="js-hover__open">
                    <input
                      type="text"
                      className="form-control form-control-lg search-field__actor search-field__arrow-down"
                      id="search-dropdown"
                      name="search-keyword"
                      value={selectedRegion}
                      readOnly
                      placeholder="Choose a location..."
                      onClick={() => setIdDDActive((pre) => !pre)}
                    />
                  </div>
                  <div className="filters-container js-hidden-content mt-2">
                    <div className="search-field__input-wrapper">
                      <input
                        type="text"
                        className="search-field__input form-control form-control-sm bg-lighter border-lighter"
                        placeholder="Search"
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
                  placeholder="Street Address *"
                />
                <label htmlFor="checkout_company_name">Street Address *</label>
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
                  placeholder="Town / City *"
                />
                <label htmlFor="checkout_city">Town / City *</label>
              </div>
            </div>
            <div className="col-md-12">
              <div className="form-floating my-3">
                <input
                  type="text"
                  className="form-control"
                  id="checkout_zipcode"
                  placeholder="Postcode / ZIP *"
                />
                <label htmlFor="checkout_zipcode">Postcode / ZIP *</label>
              </div>
            </div>
            <div className="col-md-12">
              <div className="form-floating my-3">
                <input
                  type="text"
                  className="form-control"
                  id="checkout_province"
                  placeholder="Province *"
                />
                <label htmlFor="checkout_province">Province *</label>
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
                  placeholder="Phone *"
                />
                <label htmlFor="checkout_phone">Phone *</label>
              </div>
            </div>
            <div className="col-md-12">
              <div className="form-floating my-3">
                <input
                  type="email"
                  className="form-control"
                  id="checkout_email"
                  name="email"
                  placeholder="Your Mail *"
                />
                <label htmlFor="checkout_email">Your Mail *</label>
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
                  CREATE AN ACCOUNT?
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
                  SHIP TO A DIFFERENT ADDRESS?
                </label>
              </div>
            </div>
          </div>
          <div className="col-md-12">
            <div className="mt-3">
              <textarea
                className="form-control form-control_gray"
                name="notes"
                placeholder="Order Notes (optional)"
                cols="30"
                rows="8"
              ></textarea>
            </div>
          </div>
        </div>
        <div className="checkout__totals-wrapper">
          <div className="sticky-content">
            <div className="checkout__totals">
              <h3>Your Order</h3>
              <table className="checkout-cart-items">
                <thead>
                  <tr>
                    <th>PRODUCT</th>
                    <th>SUBTOTAL</th>
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
                    <th>SUBTOTAL</th>
                    <td>{formatPrice(totalPrice)}</td>
                  </tr>
                  <tr>
                    <th>SHIPPING</th>
                    <td>Free shipping</td>
                  </tr>
                  <tr>
                    <th>VAT</th>
                    <td>{formatPrice(totalPrice && 19)}</td>
                  </tr>
                  <tr>
                    <th>TOTAL</th>
                    <td>{formatPrice(totalPrice && totalPrice + 19)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="checkout__payment-methods">
              <div className="form-check">
                <input
                  className="form-check-input form-check-input_fill"
                  type="radio"
                  name="payment"
                  id="checkout_payment_method_1"
                  value="bank"
                />
                <label
                  className="form-check-label"
                  htmlFor="checkout_payment_method_1"
                >
                  Direct bank transfer
                  <span className="option-detail d-block">
                    Make your payment directly into our bank account. Please use
                    your Order ID as the payment reference.Your order will not
                    be shipped until the funds have cleared in our account.
                  </span>
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input form-check-input_fill"
                  type="radio"
                  name="payment"
                  id="checkout_payment_method_2"
                  value="bank"
                />
                <label
                  className="form-check-label"
                  htmlFor="checkout_payment_method_2"
                >
                  Check payments
                  <span className="option-detail d-block">
                    Phasellus sed volutpat orci. Fusce eget lore mauris vehicula
                    elementum gravida nec dui. Aenean aliquam varius ipsum, non
                    ultricies tellus sodales eu. Donec dignissim viverra nunc,
                    ut aliquet magna posuere eget.
                  </span>
                </label>
              </div>
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
                    Phasellus sed volutpat orci. Fusce eget lore mauris vehicula
                    elementum gravida nec dui. Aenean aliquam varius ipsum, non
                    ultricies tellus sodales eu. Donec dignissim viverra nunc,
                    ut aliquet magna posuere eget.
                  </span>
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input form-check-input_fill"
                  type="radio"
                  name="payment"
                  id="checkout_payment_method_4"
                  value="bank"
                />
                <label
                  className="form-check-label"
                  htmlFor="checkout_payment_method_4"
                >
                  Paypal
                  <span className="option-detail d-block">
                    Phasellus sed volutpat orci. Fusce eget lore mauris vehicula
                    elementum gravida nec dui. Aenean aliquam varius ipsum, non
                    ultricies tellus sodales eu. Donec dignissim viverra nunc,
                    ut aliquet magna posuere eget.
                  </span>
                </label>
              </div>
              <div className="policy-text">
                Your personal data will be used to process your order, support
                your experience throughout this website, and for other purposes
                described in our
                <Link to="/terms" target="_blank">
                  privacy policy
                </Link>
                .
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
              <a
                className="btn btn-light mt-3 d-block"
                href={whatsappOrderUrl({
                  items: cartProducts,
                  total: totalPrice,
                })}
                target="_blank"
                rel="noreferrer"
              >
                Commander sur WhatsApp
              </a>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}
