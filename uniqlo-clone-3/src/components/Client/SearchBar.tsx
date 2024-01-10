import React, { useEffect, useMemo, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { IoMdClose } from "react-icons/io";
import { GoHome } from "react-icons/go";
import { FiUser } from "react-icons/fi";
import { Input } from "@nextui-org/react";
import clsx from "clsx";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { getSearchProducts } from "@/api/services/ClientService";
import toast from "react-hot-toast";
import { ProductBasicInfo } from "@/lib/types";
import { useDebounce } from "use-debounce";

const fetchProduct = async (searchQuery: string) => {
  const response = await getSearchProducts(searchQuery);
  if (response.error) {
    toast.error(response.error || "Error fetching products");
  } else {
    return response.data;
  }
};

const SearchBar = () => {
  const router = useRouter();
  const path = usePathname();
  const [products, setProducts] = useState<ProductBasicInfo[]>([]);
  const [isClose, setIsClose] = useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [debouncedSearchQuery] = useDebounce(searchQuery, 300);
  useEffect(() => {
    setIsClose(true);
  }, [path]);

  useEffect(() => {
    if (debouncedSearchQuery.length >= 3) {
      (async () => {
        const fetchedProducts = await fetchProduct(debouncedSearchQuery);
        setProducts(fetchedProducts);
      })();
    } else {
      setProducts([]);
    }
  }, [debouncedSearchQuery]);
  const handleChangeStage = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsClose((prev) => !prev);
  };
  const searchButtonChange = useMemo(() => {
    if (!isClose)
      return (
        <button
          onClick={handleChangeStage}
          className={"rounded-full bg-black p-4 text-4xl text-white shadow-lg"}
        >
          <IoMdClose />
        </button>
      );
    else
      return (
        <button
          onClick={handleChangeStage}
          className={"rounded-full bg-white p-4 text-4xl shadow-lg"}
        >
          <CiSearch />
        </button>
      );
  }, [isClose]);

  return (
    <>
      <div
        className={clsx("fixed bottom-[1px] z-50 flex w-full flex-col", {
          "fixed left-0 top-0 h-screen w-full flex-col bg-white": !isClose,
        })}
      >
        {/*search board*/}
        <div
          className={clsx("flex w-full justify-center ", {
            "h-0": isClose,
            "h-[calc(100%-4rem)]": !isClose, // Chỉnh lại chiều cao tùy theo kích thước mong muốn
          })}
        >
          <div className={" h-full w-full px-[20rem] pt-[4rem]"}>
            {!isClose && (
              //   Title of search
              <>
                <div className={"mb-4 bg-gray-200 p-2"}>Product name</div>
                <ul className={"pl-2"}>
                  {products?.map((product) => (
                    //   Product search results
                    <li
                      key={product.productId}
                      onClick={() => {
                        router.push(`/product/${product.productId}`);
                        setIsClose(true);
                      }}
                      className={"cursor-pointer list-none  hover:underline"}
                    >
                      {product.productName}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
        {/*Search bar*/}
        <div
          className={
            "shadow-[0_-8px_30px_-5px_rgba(0,0,0,0.1)]) h-auto px-14 py-[2rem]"
          }
        >
          <div className="flex flex-col items-center justify-center  gap-[2rem] text-3xl font-semibold uppercase ">
            <div className={clsx(" w-3/4 ", { hidden: isClose })}>
              <Input
                variant={"bordered"}
                type="text"
                radius={"full"}
                value={searchQuery}
                onValueChange={setSearchQuery}
                placeholder={"キーワード探す（例）コート"}
              />
            </div>
            <div className={"flex items-center gap-[10rem]"}>
              <div className={"rounded-full bg-white p-4 text-3xl shadow-lg"}>
                <Link href={"/"}>
                  <GoHome />
                </Link>
              </div>
              {searchButtonChange}
              <div className={"rounded-full bg-white p-4 text-3xl shadow-lg"}>
                <Link href={"/jp/member/details "}>
                  <FiUser />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchBar;
