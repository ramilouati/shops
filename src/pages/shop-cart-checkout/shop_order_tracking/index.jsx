import MetaComponent from "@/components/common/MetaComponent";
import Footer5 from "@/components/footers/Footer5";
import Header5 from "@/components/headers/Header5";
import OrderTrack from "@/components/shopCartandCheckout/OrderTrack";
const metadata = {
  title: "Shop Order Tracking || TuniShop",
  description: "TuniShop",
};
export default function ShopOrderTrackingPage() {
  return (
    <>
      <MetaComponent meta={metadata} />
      <Header5 solid />
      <main className="page-wrapper">
        <div className="pt-5 mt-5"></div>
        <OrderTrack />
      </main>
      <div className="mb-5 pb-xl-5"></div>
      <Footer5 parentClass="footer footer_type_2 dark" />
    </>
  );
}
