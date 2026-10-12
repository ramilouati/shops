import { formatPrice } from "@/utlis/formatPrice";
import { whatsappOrderUrl } from "@/utlis/whatsapp";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const paymentLabels = {
  cod: "Paiement à la livraison",
  whatsapp: "WhatsApp",
  bank: "Virement bancaire",
};

export default function OrderCompleted() {
  const [params] = useSearchParams();
  const number = params.get("order");
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!number) {
      setError("Aucune commande à afficher.");
      return;
    }
    fetch(`/api/orders/${number}`)
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Commande introuvable");
        setOrder(data);
      })
      .catch((err) => setError(err.message));
  }, [number]);

  if (error) {
    return <p className="text-center mt-5">{error}</p>;
  }
  if (!order) {
    return <p className="text-center mt-5">Chargement de la commande...</p>;
  }

  return (
    <div className="order-complete">
      <div className="order-complete__message">
        <svg
          width="80"
          height="80"
          viewBox="0 0 80 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="40" cy="40" r="40" fill="#B9A16B" />
          <path
            d="M52.9743 35.7612C52.9743 35.3426 52.8069 34.9241 52.5056 34.6228L50.2288 32.346C49.9275 32.0446 49.5089 31.8772 49.0904 31.8772C48.6719 31.8772 48.2533 32.0446 47.952 32.346L36.9699 43.3449L32.048 38.4062C31.7467 38.1049 31.3281 37.9375 30.9096 37.9375C30.4911 37.9375 30.0725 38.1049 29.7712 38.4062L27.4944 40.683C27.1931 40.9844 27.0257 41.4029 27.0257 41.8214C27.0257 42.24 27.1931 42.6585 27.4944 42.9598L33.5547 49.0201L35.8315 51.2969C36.1328 51.5982 36.5513 51.7656 36.9699 51.7656C37.3884 51.7656 37.8069 51.5982 38.1083 51.2969L40.385 49.0201L52.5056 36.8996C52.8069 36.5982 52.9743 36.1797 52.9743 35.7612Z"
            fill="white"
          />
        </svg>
        <h3>Votre commande est enregistrée</h3>
        <p>Merci {order.customerName}. Nous avons bien reçu votre commande.</p>
      </div>
      <div className="order-info">
        <div className="order-info__item">
          <label>Numéro</label>
          <span>{order.number}</span>
        </div>
        <div className="order-info__item">
          <label>Date</label>
          <span>{new Date(order.createdAt).toLocaleDateString("fr-TN")}</span>
        </div>
        <div className="order-info__item">
          <label>Total</label>
          <span>{formatPrice(order.total)}</span>
        </div>
        <div className="order-info__item">
          <label>Paiement</label>
          <span>{paymentLabels[order.payment] || order.payment}</span>
        </div>
      </div>
      <div className="checkout__totals-wrapper">
        <div className="checkout__totals">
          <h3>Détails</h3>
          <table className="checkout-cart-items">
            <thead>
              <tr>
                <th>PRODUIT</th>
                <th>SOUS-TOTAL</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, i) => (
                <tr key={i}>
                  <td>
                    {item.title} x {item.quantity}
                  </td>
                  <td>{formatPrice(item.price * item.quantity)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <table className="checkout-totals">
            <tbody>
              <tr>
                <th>TOTAL</th>
                <td>{formatPrice(order.total)}</td>
              </tr>
            </tbody>
          </table>
          <a
            className="btn btn-primary mt-4 d-block"
            href={whatsappOrderUrl({
              items: order.items,
              total: order.total,
              orderNumber: order.number,
              name: order.customerName,
              phone: order.phone,
            })}
            target="_blank"
            rel="noreferrer"
          >
            Envoyer sur WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
