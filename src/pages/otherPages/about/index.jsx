import Footer5 from "@/components/footers/Footer5";
import Header5 from "@/components/headers/Header5";
import MetaComponent from "@/components/common/MetaComponent";

const metadata = {
  title: "À propos || TuniShop",
  description: "TuniShop",
};

export default function AboutPage() {
  return (
    <>
      <MetaComponent meta={metadata} />
      <Header5 solid />
      <main className="page-wrapper">
        <section className="container pt-5 mt-5 pb-5">
          <h1 className="h2 mb-4">À propos de TuniShop</h1>
          <p className="mb-3">
            TuniShop est une boutique de mode en ligne en Tunisie. Les prix sont en dinars tunisiens et la livraison se fait à domicile.
          </p>
          <p className="mb-3">
            Le paiement à la livraison est disponible. Vous pouvez aussi envoyer votre commande sur WhatsApp depuis le panier.
          </p>
          <p className="mb-0">
            Avenue Habib Bourguiba, 1000 Tunis. Téléphone +216 70 000 000. E-mail contact@tunishop.tn.
          </p>
        </section>
      </main>
      <Footer5 parentClass="footer footer_type_2 dark" />
    </>
  );
}
