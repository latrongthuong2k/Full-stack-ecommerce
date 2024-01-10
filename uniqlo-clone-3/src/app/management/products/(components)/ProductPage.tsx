"use client";
import React, { useEffect, useState } from "react";
import { CiEdit } from "react-icons/ci";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Pagination,
  SelectItem,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
} from "@nextui-org/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Product } from "@/lib/types";
import { Select } from "@nextui-org/select";
import Search from "@/app/management/products/(components)/Search";
import toast from "react-hot-toast";
import { deleteProduct, fetchPageProduct } from "@/api/services/AuthService";

export type TableProps = {
  searchParams?: {
    q?: string;
    page?: number;
    sortField?: string;
    sortDir?: string;
  };
};
// th
// export const thRender = (attribute: string) => (
//   <th className="whitespace-nowrap p-2 first:rounded-bl-[15px] last:rounded-br-[15px]">
//     <div className="p-2">{attribute}</div>
//   </th>
// );
// // td
// export const tdRender = (attribute: string | number) => (
//   <td className="whitespace-nowrap p-5">
//     <div className="flex items-center justify-center">
//       <div className="font-medium text-gray-800">{attribute}</div>
//     </div>
//   </td>
// );
export const tdRender2 = (attribute: string | number) => (
  <td className="whitespace-nowrap p-5">
    <div
      className={`flex items-center justify-center rounded-[20px] border p-1 text-gray-700 ${
        attribute === "Active" ? "bg-blue-300" : "bg-gray-300"
      }`}
    >
      <div className="font-medium ">{attribute}</div>
    </div>
  </td>
);
// lazy load table

const statusMappings: { [key: number]: string } = {
  0: "Active",
  1: "Inactive",
  2: "Discontinued",
};

const router = useRouter();

const Products: React.FC<TableProps> = ({ searchParams }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [totalPage, setTotalPage] = useState<number>(0);
  const q = searchParams?.q || "";
  const page = searchParams?.page || 1;
  const sortField = searchParams?.sortField || "productName";
  const sortDir = searchParams?.sortDir || "asc";
  const [isDelete, setIsDelete] = useState<boolean>(false);
  const [idAction, setIdAction] = useState<number>(0);
  // const { handleOpen, setTitle, setContent, setHandleDelete, setMode } =
  //   useContext(ModalContext);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const pathName = usePathname();
  const handleDelete = async (productId: number) => {
    try {
      const res = await deleteProduct(productId, null);
      if (res) {
        if (res.success) toast.success("Product deleted successfully");
        else if (res.error) toast.error(res.error);
      }
      setIsDelete((prev) => !prev);
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
      console.error("Error deleting product:", error);
    }
  };

  function formatDate(dateString: string) {
    return dateString?.split("T")[0];
  }

  const productModal = () => (
    <>
      {/*<Button onPress={onOpen}>Open Modal</Button>*/}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">warning</ModalHeader>
              <ModalBody>
                <p>
                  This action will delete this product forever, are you sure to
                  delete ?
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="default" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button
                  color="danger"
                  onPress={() => {
                    onClose();
                    handleDelete(idAction);
                  }}
                >
                  Delete
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );

  useEffect(() => {
    const fetchProductTable = async () => {
      try {
        const productPage = await fetchPageProduct(
          q,
          page,
          10,
          sortField,
          sortDir,
        );
        if (productPage) {
          setTotalPage(productPage.data.totalPages);
          setProducts(productPage.data.content);
        }
      } catch (error) {}
    };
    fetchProductTable().catch((err) =>
      toast.error("Error fetching products" + err),
    );
  }, [page, q, sortDir, sortField, isDelete]);
  const sortObjs = [
    {
      key: 1,
      value: "productName",
      label: "Product name",
    },
    {
      key: 2,
      value: "",
      label: "Time",
    },
    {
      key: 3,
      value: "price",
      label: "Price",
    },
  ];
  const statusMappings: { [key: number]: string } = {
    0: "Active",
    1: "Inactive",
    2: "Discontinued",
  };
  return (
    <>
      {productModal()}
      <div className="container mx-auto mr-14 mt-14">
        <Button
          onClick={() => {
            router.push(`/products/add`);
          }}
        >
          Add new product
        </Button>
        <div className="flex justify-between">
          <Search />
          <Select
            defaultSelectedKeys={"productName"}
            variant={"underlined"}
            label="Select an animal"
            className="max-w-lg"
          >
            {sortObjs.map((sortType) => (
              <SelectItem key={sortType.value} value={sortType.value}>
                {sortType.label}
              </SelectItem>
            ))}
          </Select>
        </div>

        <Table aria-label="Example static collection table">
          <TableHeader className={"uppercase"}>
            <TableColumn>Product Name</TableColumn>
            <TableColumn>Create at</TableColumn>
            <TableColumn>Update at</TableColumn>
            <TableColumn>Quantity</TableColumn>
            <TableColumn>Price</TableColumn>
            <TableColumn>Status</TableColumn>
            <TableColumn>Actions</TableColumn>
          </TableHeader>
          <TableBody>
            {products.map((product, index) => (
              <TableRow key="1">
                <TableCell>{product.productName}</TableCell>
                <TableCell>{product.createdAt}</TableCell>
                <TableCell>{product.updatedAt}</TableCell>
                <TableCell>{product.stockQuantity}</TableCell>
                <TableCell>{product.unitPrice}</TableCell>
                <TableCell>
                  {statusMappings[product.status] || "Unknown"}
                </TableCell>
                <TableCell>
                  <Link
                    className={
                      "mr-2 rounded-[20px] border-4 px-4 py-2 text-violet-400 hover:border-violet-300 hover:text-violet-600"
                    }
                    href={`${pathName}/edit?productId=${product.id}`}
                  >
                    <CiEdit />
                    Edit
                  </Link>
                </TableCell>
                <TableCell>
                  <button
                    onClick={() => {
                      onOpen();
                      setIdAction(product.id);
                    }}
                    className="rounded-[20px] border-4 px-4 py-2 text-red-400 hover:border-red-300 hover:text-red-600"
                  >
                    Delete
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className={"ml-2 mt-6"}>
          <Pagination total={totalPage} initialPage={1} />
        </div>
      </div>
    </>
  );
};

export default Products;
