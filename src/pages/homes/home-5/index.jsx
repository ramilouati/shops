import Footer5 from "@/components/footers/Footer5";

import Header5 from "@/components/headers/Header5";
import BestSeller from "@/components/homes/home-5/BestSeller";
import Categories from "@/components/homes/home-5/Categories";
import Cta from "@/components/homes/home-5/Cta";
import Features from "@/components/homes/home-5/Features";
import Hero from "@/components/homes/home-5/Hero";
import TopCollections from "@/components/homes/home-5/TopCollections";
import WeekDeals from "@/components/homes/home-5/WeekDeals";

import MetaComponent from "@/components/common/MetaComponent";
const metadata = {
  title: "TuniShop || Boutique de mode en ligne",
  description: "Découvrez notre boutique de mode en ligne : nouveautés, meilleures ventes et offres de la semaine.",
};
export default function HomePage5() {
  return (
    <>
      <MetaComponent meta={metadata} />
      <Header5 />
      <main className="bg-grey-faf9f8 page-wrapper-3">
        <Hero />
        <div className="mb-4 mb-xl-5 pt-1 pb-5"></div>
        <Categories />
        <div className="mb-4 mb-xl-5 pt-1 pb-5"></div>
        <TopCollections />
        <div className="pt-1 pb-5 mb-4 mb-xl-5"></div>
        <BestSeller />
        <WeekDeals />
        <div className="pt-1 pb-5 mt-4 mt-xl-5"></div>
        <Features />
        <Cta />
      </main>
      <Footer5 parentClass={"footer footer_type_2 dark"} />
    </>
  );
}
