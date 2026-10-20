import Footer5 from "@/components/footers/Footer5";
import Header5 from "@/components/headers/Header5";
import RelatedSlider from "@/components/singleProduct/RelatedSlider";
import SingleProduct12 from "@/components/singleProduct/SingleProduct12";
import MetaComponent from "@/components/common/MetaComponent";
import { apiUrl } from "@/utlis/api";
import { useContextElement } from "@/context/Context";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const metadata = {
  title: "Article || TuniShop",
  description: "TuniShop",
};

export default function ProductDetailsPage1() {
  const params = useParams();
  const { catalog } = useContextElement();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const known = catalog.find((item) => item.id == params.id) || null;
    setProduct(known);
    fetch(apiUrl(`/api/products/${params.id}`))
      .then((response) => (response.ok ? response.json() : null))
      .then((live) => {
        if (live?.id) setProduct(live);
      })
      .catch(() => {});
  }, [params.id, catalog]);

  return (
    <>
      <MetaComponent meta={metadata} />
      <Header5 solid />
      <main className="page-wrapper">
        <div className="pt-5 mt-4"></div>
        {product ? <SingleProduct12 product={product} /> : <p className="container">Article introuvable.</p>}
        <RelatedSlider />
      </main>
      <Footer5 parentClass="footer footer_type_2 dark" />
    </>
  );
}
