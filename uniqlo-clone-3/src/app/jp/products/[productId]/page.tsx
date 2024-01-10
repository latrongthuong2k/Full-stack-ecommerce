import React from "react";
import ProductRender from "@/app/jp/products/[productId]/ProductRender";

type pageProps = {
  params: { productId: String };
};
const productPage = ({ params }: pageProps) => {
  return (
    <div>
      <ProductRender params={params} />
    </div>
  );
};

export default productPage;
