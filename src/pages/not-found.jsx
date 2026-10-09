import MetaComponent from "@/components/common/MetaComponent";
import PageNotFound from "./otherPages/page-not-found";
const metadata = {
  title: "Page Not Found || TuniShop",
  description: "TuniShop",
};
export default function NotFound() {
  return (
    <>
      <MetaComponent meta={metadata} />
      <PageNotFound />
    </>
  );
}
