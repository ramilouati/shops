import Footer5 from "@/components/footers/Footer5";
import Header5 from "@/components/headers/Header5";
import MetaComponent from "@/components/common/MetaComponent";
import { useContextElement } from "@/context/Context";
import { formatPrice } from "@/utlis/formatPrice";
import { Link } from "react-router-dom";

const metadata = {
  title: "Favoris || TuniShop",
  description: "TuniShop",
};

export default function AccountWishlistPage() {
  const { wishList, catalog, toggleWishlist, addProductToCart } = useContextElement();
  const products = catalog.filter((product) => wishList.some((id) => id == product.id));

  return (
    <>
      <MetaComponent meta={metadata} />
      <Header5 solid />
      <main className="page-wrapper">
        <section className="container pt-5 mt-5 pb-5">
          <h1 className="h2 mb-4">Favoris</h1>
          {products.length ? (
            <div className="row">
              {products.map((product) => (
                <div key={product.id} className="col-6 col-md-3 mb-4">
                  <Link to={`/product1_simple/${product.id}`}>
                    {product.imgSrc ? <img src={product.imgSrc} alt={product.title} className="w-100 mb-2" /> : null}
                    <span className="d-block">{product.title}</span>
                  </Link>
                  <span className="d-block mb-2">{formatPrice(product.price)}</span>
                  <button type="button" className="btn btn-sm btn-primary me-2" onClick={() => addProductToCart(product.id)} disabled={product.stock === 0}>
                    {product.stock === 0 ? "Rupture" : "Ajouter"}
                  </button>
                  <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => toggleWishlist(product.id)}>
                    Retirer
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p>
              Aucun favori pour le moment. <Link to="/shop-1">Voir la boutique</Link>
            </p>
          )}
        </section>
      </main>
      <Footer5 parentClass="footer footer_type_2 dark" />
    </>
  );
}
