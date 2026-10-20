import { Link, useLocation } from "react-router-dom";

import { useEffect, useState } from "react";

const steps = [
  {
    id: 1,
    href: "/shop_cart",
    number: "01",
    title: "Panier",
    description: "Vérifiez vos articles",
  },
  {
    id: 2,
    href: "/shop_checkout",
    number: "02",
    title: "Livraison",
    description: "Adresse et paiement",
  },
  {
    id: 3,
    href: "/shop_order_complete",
    number: "03",
    title: "Confirmation",
    description: "Commande envoyée",
  },
];
export default function ChectoutSteps() {
  const [activePathIndex, setactivePathIndex] = useState(0);
  const { pathname } = useLocation();
  useEffect(() => {
    const activeTab = steps.filter((elm) => elm.href == pathname)[0];
    const activeTabIndex = steps.indexOf(activeTab);
    setactivePathIndex(activeTabIndex);
  }, [pathname]);
  return (
    <div className="checkout-steps">
      {steps.map((elm, i) => (
        <Link
          key={i}
          to={elm.href}
          className={`checkout-steps__item  ${
            activePathIndex >= i ? "active" : ""
          }`}
        >
          <span className="checkout-steps__item-number">{elm.number}</span>
          <span className="checkout-steps__item-title">
            <span>{elm.title}</span>
            <em>{elm.description}</em>
          </span>
        </Link>
      ))}
    </div>
  );
}
