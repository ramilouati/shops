import { apiUrl } from "@/utlis/api";
import { formatPrice } from "@/utlis/formatPrice";
import { useState } from "react";

const statusLabels = {
  nouvelle: "Reçue",
  confirmée: "Confirmée",
  expédiée: "Expédiée",
  livrée: "Livrée",
  annulée: "Annulée",
};

export default function OrderTrack() {
  const [number, setNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");

  const track = async (event) => {
    event.preventDefault();
    setError("");
    setOrder(null);
    const response = await fetch(
      apiUrl(`/api/orders/${number.trim().toUpperCase()}?phone=${encodeURIComponent(phone.trim())}`)
    );
    const data = await response.json();
    if (!response.ok) {
      setError(data.error || "Commande introuvable.");
      return;
    }
    if (phone.trim() && data.phone !== phone.trim()) {
      setError("Ce numéro ne correspond pas à la commande.");
      return;
    }
    setOrder(data);
  };

  return (
    <section className="shop-checkout container">
      <div className="order-tracking">
        <form onSubmit={track} className="needs-validation">
          <h2 className="page-title">Suivi de commande</h2>
          <p>Entrez le numéro de commande (TS-1001) et le téléphone utilisés lors de l’achat.</p>
          <div className="form-floating my-4">
            <input
              type="text"
              className="form-control"
              id="order_tracking_id"
              placeholder="TS-1001"
              value={number}
              onChange={(event) => setNumber(event.target.value)}
              required
            />
            <label htmlFor="order_tracking_id">Numéro de commande</label>
          </div>
          <div className="form-floating my-4">
            <input
              type="tel"
              className="form-control"
              id="order_tracking_phone"
              placeholder="Téléphone"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              required
            />
            <label htmlFor="order_tracking_phone">Téléphone</label>
          </div>
          <button type="submit" className="btn btn-primary btn-track w-100">
            Suivre
          </button>
          {error && <p className="text-danger mt-3">{error}</p>}
        </form>
        {order && (
          <div className="mt-4">
            <h3 className="h5">{order.number}</h3>
            <p>
              Statut : <strong>{statusLabels[order.status] || order.status}</strong>
            </p>
            <p>
              {order.customerName} · {order.city}
            </p>
            <p>Total : {formatPrice(order.total)}</p>
            <ul>
              {order.items.map((item, index) => (
                <li key={index}>
                  {item.title} x{item.quantity}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
