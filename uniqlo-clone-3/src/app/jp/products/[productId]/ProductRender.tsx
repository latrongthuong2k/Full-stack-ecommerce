import React from "react";
import { fetchProductById, getSizes } from "@/api/services/ClientService";
import { ProductFullInfo, Size } from "@/lib/types";
import ImageCarousel from "@/components/Client/Carousel";
import Content from "@/app/jp/products/[productId]/Content";
import { notFound } from "next/navigation";

type pageProps = {
  params: { productId: String };
};

async function ProductRender({ params }: pageProps) {
  const productData = await fetchProductById(params.productId);
  const sizeData = await getSizes();
  const allSize: Size[] = sizeData.data;
  const product: ProductFullInfo = productData.data;
  if (!product) {
    notFound();
  }
  const images = product?.productImages || [];
  return (
    <>
      {/*<Breadcrumbs size={"lg"} className={"mb-8"}>*/}
      {/*    <BreadcrumbItem>{searchParams.get("root")}</BreadcrumbItem>*/}
      {/*    <BreadcrumbItem>{searchParams.get("cate")}</BreadcrumbItem>*/}
      {/*    <BreadcrumbItem>{product.productName}</BreadcrumbItem>*/}
      {/*</Breadcrumbs>*/}
      <div className={"pt-8"}>
        <p className={"mb-4 bg-[#474747] py-2 text-center text-white"}>
          店舗受取りなら送料無料
        </p>
        <p className={"mb-4 text-4xl"}> {product.productName}</p>
        <p className={"mb-4 "}> {product.description}</p>
        <p className={"mb-4 text-gray-500"}> 商品番号 : {product.sku}</p>
      </div>
      <div className={"flex gap-10"}>
        <ImageCarousel images={images} />
        <div>
          <Content productData={product} sizes={allSize} />
        </div>
      </div>
    </>
  );
}

export default ProductRender;
