import React from "react";
import Products from "./(components)/ProductPage";
import { DataProvider } from "../../../components/Admin/context/DataProvider";

const Page = ({ searchParams }) => {
  return (
    <DataProvider>
      <Products searchParams={searchParams} />
    </DataProvider>
  );
};

export default Page;
