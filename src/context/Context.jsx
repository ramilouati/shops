/* eslint-disable react/prop-types */
import { apiUrl } from "@/utlis/api";
import React, { useEffect } from "react";
import { useContext, useState } from "react";
const dataContext = React.createContext();
// eslint-disable-next-line react-refresh/only-export-components
export const useContextElement = () => {
  return useContext(dataContext);
};

export default function Context({ children }) {
  const [cartProducts, setCartProducts] = useState([]);
  const [wishList, setWishList] = useState([]);
  const [quickViewItem, setQuickViewItem] = useState(null);
  const [catalog, setCatalog] = useState([]);
  const [shopPhone, setShopPhone] = useState("21620000000");
  const [totalPrice, setTotalPrice] = useState(0);
  const [customer, setCustomer] = useState(null);
  const [authReady, setAuthReady] = useState(false);

  const syncWishlist = async (ids) => {
    if (!customer) return;
    await fetch(apiUrl("/api/customer/wishlist"), {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ productIds: ids }),
    }).catch(() => {});
  };

  useEffect(() => {
    fetch(apiUrl("/api/settings"))
      .then((response) => response.json())
      .then((settings) => {
        const phone = String(settings.whatsappPhone || "").replace(/\D/g, "");
        if (phone) setShopPhone(phone);
      })
      .catch(() => {});
  }, []);
  useEffect(() => {
    fetch(apiUrl("/api/products"))
      .then((response) => response.json())
      .then((products) => {
        if (Array.isArray(products)) setCatalog(products);
      })
      .catch(() => {});
  }, []);
  useEffect(() => {
    fetch(apiUrl("/api/customer/me"), { credentials: "include" })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (data?.user) {
          setCustomer(data.user);
          const local = JSON.parse(localStorage.getItem("wishlist") || "[]");
          const merged = [...new Set([...(data.wishlist || []), ...local.map(Number)])];
          setWishList(merged);
          fetch(apiUrl("/api/customer/wishlist"), {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ productIds: merged }),
          }).catch(() => {});
        } else {
          const items = JSON.parse(localStorage.getItem("wishlist") || "[]");
          if (items?.length) setWishList(items);
        }
      })
      .catch(() => {
        const items = JSON.parse(localStorage.getItem("wishlist") || "[]");
        if (items?.length) setWishList(items);
      })
      .finally(() => setAuthReady(true));
  }, []);
  useEffect(() => {
    const subtotal = cartProducts.reduce((accumulator, product) => {
      return accumulator + product.quantity * product.price;
    }, 0);
    setTotalPrice(subtotal);
  }, [cartProducts]);

  const stockCap = (item) => {
    const stock = Number(item?.stock);
    if (Number.isInteger(stock) && stock >= 0) return Math.min(20, stock);
    return 20;
  };
  const setItemQuantity = (id, quantity) => {
    setCartProducts((prev) =>
      prev.map((item) => {
        if (item.id != id) return item;
        const next = Math.min(stockCap(item), Math.max(1, Math.floor(Number(quantity) || 1)));
        return { ...item, quantity: next };
      })
    );
  };
  const addProductToCart = (id) => {
    if (!cartProducts.filter((elm) => elm.id == id)[0]) {
      const source = catalog.find((elm) => elm.id == id);
      if (!source || source.price == null || source.stock === 0) return;
      const item = { ...source, quantity: 1 };
      setCartProducts((pre) => [...pre, item]);

      document
        .getElementById("cartDrawerOverlay")
        ?.classList.add("page-overlay_visible");
      document.getElementById("cartDrawer")?.classList.add("aside_visible");
    }
  };
  const isAddedToCartProducts = (id) => {
    if (cartProducts.filter((elm) => elm.id == id)[0]) {
      return true;
    }
    return false;
  };

  const toggleWishlist = (id) => {
    setWishList((pre) => {
      const next = pre.some((item) => item == id)
        ? pre.filter((elm) => elm != id)
        : [...pre, id];
      syncWishlist(next);
      return next;
    });
  };
  const isAddedtoWishlist = (id) => wishList.some((item) => item == id);

  const loginCustomer = async ({ email, password }) => {
    const response = await fetch(apiUrl("/api/customer/login"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });
    const body = await response.json();
    if (!response.ok) return { error: body.error || "Connexion impossible." };
    setCustomer(body.user);
    const me = await fetch(apiUrl("/api/customer/me"), { credentials: "include" }).then((r) => r.json());
    const local = JSON.parse(localStorage.getItem("wishlist") || "[]");
    const merged = [...new Set([...(me.wishlist || []), ...local.map(Number)])];
    setWishList(merged);
    await syncWishlist(merged);
    return { user: body.user };
  };

  const registerCustomer = async ({ name, email, phone, password }) => {
    const response = await fetch(apiUrl("/api/register"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ name, email, phone, password }),
    });
    const body = await response.json();
    if (!response.ok) return { error: body.error || "Inscription impossible." };
    setCustomer(body.user);
    const local = JSON.parse(localStorage.getItem("wishlist") || "[]");
    setWishList(local);
    await syncWishlist(local);
    return { user: body.user };
  };

  const logoutCustomer = async () => {
    await fetch(apiUrl("/api/customer/logout"), { method: "POST", credentials: "include" });
    setCustomer(null);
  };

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem("cartList"));
    if (items?.length) {
      setCartProducts(items);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cartList", JSON.stringify(cartProducts));
  }, [cartProducts]);

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishList));
  }, [wishList]);

  const contextElement = {
    cartProducts,
    setCartProducts,
    totalPrice,
    addProductToCart,
    setItemQuantity,
    isAddedToCartProducts,
    toggleWishlist,
    isAddedtoWishlist,
    quickViewItem,
    catalog,
    shopPhone,
    wishList,
    setQuickViewItem,
    customer,
    authReady,
    loginCustomer,
    registerCustomer,
    logoutCustomer,
  };
  return (
    <dataContext.Provider value={contextElement}>
      {children}
    </dataContext.Provider>
  );
}
