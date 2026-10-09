import Footer1 from "@/components/footers/Footer1";

import Header1 from "@/components/headers/Header1";
import Notfound from "@/components/otherPages/Notfound";

import MetaComponent from "@/components/common/MetaComponent";
const metadata = {
  title: "Page Not Found || TuniShop",
  description: "TuniShop",
};
export default function PageNotFound() {
  return (
    <>
      <MetaComponent meta={metadata} />
      <Header1 />
      <main className="page-wrapper">
        <div className="mb-4 pb-4"></div>
        <Notfound />
      </main>

      <div className="mb-5 pb-xl-5"></div>
      <Footer1 />
    </>
  );
}
