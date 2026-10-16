import MetaComponent from "@/components/common/MetaComponent";
import Footer1 from "@/components/footers/Footer1";
import Header1 from "@/components/headers/Header1";
import { apiUrl } from "@/utlis/api";
import { formatPrice } from "@/utlis/formatPrice";
import { useEffect, useState } from "react";

const metadata = {
  title: "Commandes || TuniShop",
  description: "TuniShop",
};

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(apiUrl("/api/orders"))
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Impossible de charger les commandes");
        setOrders(data);
      })
      .catch((err) => setError(err.message));
  }, []);

  return (
    <>
      <MetaComponent meta={metadata} />
      <Header1 />
      <main className="page-wrapper">
        <div className="mb-4 pb-4"></div>
        <section className="container">
          <h2 className="page-title">Commandes</h2>
          {error && <p>{error}</p>}
          {!error && !orders.length && <p>Aucune commande pour le moment.</p>}
          {orders.map((order) => (
            <div key={order.number} className="mb-4 pb-3 border-bottom">
              <h3 className="h6 mb-1">
                {order.number} · {order.customerName} · {formatPrice(order.total)}
              </h3>
              <p className="mb-1 text-secondary">
                {order.phone} · {order.city} · {order.status} ·{" "}
                {new Date(order.createdAt).toLocaleString("fr-TN")}
              </p>
              <p className="mb-0">
                {order.items.map((item) => `${item.title} x${item.quantity}`).join(", ")}
              </p>
            </div>
          ))}
        </section>
      </main>
      <div className="mb-5 pb-xl-5"></div>
      <Footer1 />
    </>
  );
}
