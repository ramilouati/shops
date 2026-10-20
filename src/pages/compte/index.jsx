import Footer5 from "@/components/footers/Footer5";
import Header5 from "@/components/headers/Header5";
import MetaComponent from "@/components/common/MetaComponent";
import { useContextElement } from "@/context/Context";
import { apiUrl } from "@/utlis/api";
import { formatPrice } from "@/utlis/formatPrice";
import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";

const metadata = {
  title: "Mon compte || TuniShop",
  description: "TuniShop",
};

export default function ComptePage() {
  const { customer, authReady, logoutCustomer, wishList, catalog, toggleWishlist } = useContextElement();
  const [orders, setOrders] = useState([]);
  const favorites = catalog.filter((product) => wishList.some((id) => id == product.id));

  useEffect(() => {
    if (!customer) return;
    fetch(apiUrl("/api/customer/orders"), { credentials: "include" })
      .then((response) => (response.ok ? response.json() : []))
      .then(setOrders)
      .catch(() => setOrders([]));
  }, [customer]);

  if (authReady && !customer) return <Navigate to="/login_register" replace />;

  return (
    <>
      <MetaComponent meta={metadata} />
      <Header5 solid />
      <main className="page-wrapper">
        <section className="container pt-5 mt-5 pb-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h1 className="h2 mb-1">Bonjour {customer?.name}</h1>
              <p className="mb-0 text-secondary">{customer?.email}</p>
            </div>
            <button
              type="button"
              className="btn btn-light"
              onClick={async () => {
                await logoutCustomer();
              }}
            >
              Déconnexion
            </button>
          </div>

          <h2 className="h4 mb-3">Mes commandes</h2>
          {orders.length ? (
            <table className="table mb-5">
              <thead>
                <tr>
                  <th>Numéro</th>
                  <th>Date</th>
                  <th>Total</th>
                  <th>Statut</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.number}>
                    <td>
                      <Link to={`/shop_order_tracking?number=${order.number}`}>{order.number}</Link>
                      <br />
                      <small>{order.items?.map((item) => `${item.title} x${item.quantity}`).join(", ")}</small>
                    </td>
                    <td>{String(order.createdAt || "").slice(0, 10)}</td>
                    <td>{formatPrice(order.total)}</td>
                    <td>{order.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="mb-5">Aucune commande pour le moment. <Link to="/shop-1">Voir la boutique</Link></p>
          )}

          <h2 className="h4 mb-3">Favoris</h2>
          {favorites.length ? (
            <div className="row">
              {favorites.map((product) => (
                <div key={product.id} className="col-6 col-md-3 mb-4">
                  <Link to={`/product1_simple/${product.id}`}>
                    {product.imgSrc ? <img src={product.imgSrc} alt={product.title} className="w-100 mb-2" /> : null}
                    <span className="d-block">{product.title}</span>
                  </Link>
                  <span className="d-block mb-2">{formatPrice(product.price)}</span>
                  <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => toggleWishlist(product.id)}>
                    Retirer
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p>
              Aucun favori. <Link to="/shop-1">Ajouter des articles</Link>
            </p>
          )}
        </section>
      </main>
      <Footer5 parentClass="footer footer_type_2 dark" />
    </>
  );
}
