"use client";
import React, { useContext, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { CircularProgress } from "@mui/joy";
import { CustomTableProps, Bill } from "@/Type/type";
import PaginationTable from "@/app/products/(components)/PaginationTable";
import Search from "@/app/products/(components)/Search";
import SortBar from "@/app/products/(components)/SortButtons";
import { MenuItem } from "@mui/material";

import { cancelBill, fetchPageBills } from "@/services/OrdersService";
import { useNotification } from "@/app/context/NotificationContext";
import { BillContextData } from "@/app/context/OrderContextData";

const LazyLoadedTableBody = dynamic(() => import("./LazyLoadedTbodyOrder"), {
  loading: () => (
    <tbody>
      <tr>
        <td className={"flex justify-center p-5"}>
          <CircularProgress />
        </td>
      </tr>
    </tbody>
  ),
  ssr: false,
});

const thRender = (attribute: string) => (
  <th className="whitespace-nowrap p-2">
    <div className="p-2">{attribute}</div>
  </th>
);

const BillPage: React.FC<CustomTableProps> = ({ searchParams }) => {
  const [bills, setBills] = useState<Bill[]>([]);
  const [totalPage, setTotalPage] = useState<number>(0);
  const q = searchParams?.q || "";
  const page = searchParams?.page || 1;
  const sortField = searchParams?.sortField || "createdDate";
  const sortDir = searchParams?.sortDir || "asc";
  const [isDelete, setIsDelete] = useState<boolean>(false);

  // @ts-ignore
  const { isSubmit } = useContext(BillContextData);
  // @ts-ignore
  const { showNotification } = useNotification();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchPageBills(q, page, 10, sortField, sortDir);
        if (response.success) {
          setTotalPage(response.data.totalPages);
          setBills(response.data.bills);
        } else {
          showNotification("error", "Error :" + response.err);
        }
      } catch (error) {
        showNotification("error", "Error fetching bills : " + error);
      }
    };
    fetchData();
  }, [isSubmit, isDelete, page, q, showNotification, sortDir, sortField]);
  // handle delete
  const handleCancelBill = async (billId: number) => {
    try {
      const res = await cancelBill(billId);
      if (res.success) showNotification("success", res.data);
      else showNotification("error", res.err);
      setIsDelete((prev) => !prev);
    } catch (error) {
      showNotification("error", "Error deleting product : " + error);
    }
  };

  return (
    <div className="container mx-auto mt-14">
      {/*<UserModalProvider>*/}
      {/*  <AddButton buttonName={`Add new ${targetProps}`} />*/}
      {/*</UserModalProvider>*/}
      <div className="flex justify-between">
        <Search />
        <SortBar
          optionProps={[
            <MenuItem value="id" key="id">
              ID
            </MenuItem>,
            <MenuItem value="createdDate" key="createdDate">
              Created Date
            </MenuItem>,
            <MenuItem value="billStatus" key="billStatus">
              Status
            </MenuItem>,
          ]}
          defaultSortField={"createdDate"}
        />
      </div>
      {/*Khung table */}
      <div className="overflow-x-auto rounded-[20px] border-4 bg-gray-50 pb-6 shadow-lg">
        {/*Table */}
        <table className="w-full table-auto">
          <thead>
            <tr className="mb-[5px] rounded bg-teal-800 text-center text-lg font-semibold uppercase text-white">
              {thRender("ID")}
              {thRender("Create Date")}
              {thRender("Approved Date")}
              {thRender("Created By")}
              {thRender("Approved By")}
              {thRender("Bill Status")}
              {thRender("Action")}
            </tr>
          </thead>
          {/*T-Body*/}
          <LazyLoadedTableBody handle={handleCancelBill} bills={bills} />
        </table>
      </div>
      <div className={"ml-2 mt-6"}>
        <PaginationTable totalPage={totalPage} />
      </div>
    </div>
  );
};

export default BillPage;
