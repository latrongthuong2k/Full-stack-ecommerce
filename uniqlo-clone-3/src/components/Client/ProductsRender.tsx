import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getProducts } from "@/api/services/ClientService";
import { motion } from "framer-motion";
import Image from "next/image";

import { useRouter } from "next/navigation";
import {
  ListProduct,
  ProductBasicInfo,
  ProductsRenderProps,
} from "@/lib/types";
import { useSectionWhenTrigger } from "@/lib/hooks";
import FilterBar from "@/components/Client/FilterBar";
import { Select } from "@nextui-org/select";
import { SelectItem } from "@nextui-org/react";
import { useFilterDataSectionContext } from "@/context/FilterDataContext";
import { Key } from "@react-types/shared";
import {
  createWishProducts,
  getWishProducts,
} from "@/api/services/AuthService";
import { useCartAndWishlist } from "@/context/CartAndWishlistContext";
import { useProductDataContext } from "@/context/ProductDataContext";
import {
  selectedAnimationProps,
  selectItem,
  unselectedAnimationProps,
} from "@/lib/data";
import HeartWish from "@/components/Client/HeartWish";

const fetchProducts = async (
  sortField: string,
  sortDir: string,
  sizeDto: Key[],
  categoryDto: string,
  priceDto: string,
) => {
  // formData.append("sortField", sortField);
  const params = {
    productSize: sizeDto.join(","),
    price: priceDto,
    categoryId: categoryDto,
    sortField: sortField,
    sortDir: sortDir,
    // thêm các tham số khác nếu cần
  };
  const queryString = new URLSearchParams(params).toString();
  return await getProducts(queryString);
};

const ProductsRender = ({
  rootName,
  categoryId,
  categoryName,
}: ProductsRenderProps) => {
  const { ref } = useSectionWhenTrigger("outContent", 0.1);
  const { sizesDto, categoryDto, priceDto } = useFilterDataSectionContext();
  const { setIsWishProductAction } = useCartAndWishlist();
  const router = useRouter();
  const [sortField, setSortField] = useState<string>("");
  const [sortDir, setSortDir] = useState<string>("");
  // const [wishState, setWishState] = useState<{ [key: number]: boolean }>({});
  const [products, setProducts] = useState<ListProduct>({
    content: [],
    length: 0,
  });

  //------
  useEffect(() => {
    // mount for render lần đầu
    setIsWishProductAction((prevState) => !prevState);
  }, []);

  const handleSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    selectItem().forEach((item) => {
      if (item.id.toString() === e.target.value) {
        setSortField(item.key);
        setSortDir(item.direction);
      }
    });
  };

  useEffect(() => {
    (async () => {
      const fetchedProducts = await fetchProducts(
        sortField,
        sortDir,
        sizesDto,
        categoryDto ? categoryDto : categoryId.toString(),
        priceDto,
      );
      if (fetchedProducts.error) {
        throw new Error(fetchedProducts.error || "Error fetching products");
      } else {
        setProducts(fetchedProducts.data);
      }
    })();
  }, [categoryDto, categoryId, priceDto, sizesDto, sortDir, sortField]);

  const handleProductClick = (
    productId: number,
    rootName: string,
    categoryName: string,
  ) => {
    router.push(
      `/jp/products/${productId}?root=${rootName}?cate=${categoryName}`,
    );
  };

  return (
    <>
      <section ref={ref} />
      <div className={"flex items-center justify-between p-3 "}>
        <p>{`${products.content.length} 件`}</p>
        <div className={"flex w-[9rem] items-center gap-2 "}>
          <Select
            label="並べ替え"
            variant={"underlined"}
            radius={"full"}
            size={"lg"}
            className="max-w-xs"
            onChange={(e) => handleSelectionChange(e)}
          >
            {selectItem().map((item) => (
              <SelectItem key={item.id} value={item.id}>
                {item.label}
              </SelectItem>
            ))}
          </Select>
        </div>
      </div>

      {/*filter bar*/}

      <FilterBar id={categoryId} />
      <div className={" grid grid-cols-4 gap-7"}>
        {products?.content?.map((product: ProductBasicInfo, index: number) => (
          <motion.div
            key={index}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              duration: 0.7,
              ease: [0.37, 0.3, 0, 0.6],
              delay: 0.06 * index,
            }}
            onClick={() =>
              handleProductClick(product.productId, rootName, categoryName)
            }
            className={"cursor-pointer"}
          >
            <div className={"relative mb-4"}>
              <Image
                src={`${product.s3ProductImages[0]?.url || "/next.svg"}`}
                width={300}
                height={300}
                style={{ width: "276px", height: "276px", objectFit: "cover" }}
                priority={true}
                quality={50}
                alt={product.productName}
              />
              <div className="absolute right-4 top-3 text-2xl">
                <HeartWish productData={product} />
              </div>
            </div>
            <div className={"pl-2"}>
              <p className={"mb-2"}>
                {product.sizes.length > 0
                  ? `${product.sizes[0].label}${
                      product.sizes.length > 1
                        ? ", " + product.sizes[1].label + "..."
                        : ""
                    }`
                  : ""}
              </p>
              <p className={"mb-2"}>{product.productName}</p>
              <p className={"text-xl"}>
                {`￥` + product.unitPrice.toLocaleString("ja-JP")}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </>
  );
};

export default ProductsRender;
