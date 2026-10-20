import Footer5 from "@/components/footers/Footer5";
import Header5 from "@/components/headers/Header5";
import Shop1 from "@/components/shoplist/Shop1";
import MetaComponent from "@/components/common/MetaComponent";

const metadata = {
  title: "Nouveautés || TuniShop",
  description: "TuniShop",
};

export default function ShopPage2() {
  return (
    <>
      <MetaComponent meta={metadata} />
      <Header5 solid />
      <main className="page-wrapper">
        <div className="pt-5 mt-4"></div>
        <Shop1 title="Nouveautés" section="collection" />
      </main>
      <div className="mb-5 pb-xl-5"></div>
      <Footer5 parentClass="footer footer_type_2 dark" />
    </>
  );
}
