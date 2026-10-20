import MetaComponent from "@/components/common/MetaComponent";
import Footer5 from "@/components/footers/Footer5";
import Header5 from "@/components/headers/Header5";
import Cart from "@/components/shopCartandCheckout/Cart";
import ChectoutSteps from "@/components/shopCartandCheckout/ChectoutSteps";
const metadata = {
  title: "Panier || TuniShop",
  description: "TuniShop",
};
export default function ShopCartPage() {
  return (
    <>
      <MetaComponent meta={metadata} />
      <Header5 solid />
      <main className="page-wrapper">
        <div className="mb-4 pb-4"></div>
        <section className="shop-checkout container pt-5 mt-4">
          <h2 className="page-title">Panier</h2>
          <ChectoutSteps />
          <Cart />
        </section>
      </main>
      <div className="mb-5 pb-xl-5"></div>
      <Footer5 parentClass="footer footer_type_2 dark" />
    </>
  );
}
