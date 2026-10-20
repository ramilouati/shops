import Footer5 from "@/components/footers/Footer5";
import Header5 from "@/components/headers/Header5";
import MetaComponent from "@/components/common/MetaComponent";

const metadata = {
  title: "Contact || TuniShop",
  description: "TuniShop",
};

export default function ContactPage() {
  return (
    <>
      <MetaComponent meta={metadata} />
      <Header5 solid />
      <main className="page-wrapper">
        <section className="container pt-5 mt-5 pb-5">
          <h1 className="h2 mb-4">Contact</h1>
          <p className="mb-2">Avenue Habib Bourguiba, 1000 Tunis, Tunisie</p>
          <p className="mb-2">Téléphone : +216 70 000 000</p>
          <p className="mb-2">E-mail : contact@tunishop.tn</p>
          <p className="mb-0">
            Pour une commande, passez par la boutique : le paiement se fait à la livraison, ou par WhatsApp depuis le panier.
          </p>
        </section>
      </main>
      <Footer5 parentClass="footer footer_type_2 dark" />
    </>
  );
}
