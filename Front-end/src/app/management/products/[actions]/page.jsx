import React from "react";
import ActionPage from "@/app/products/[actions]/ActionPage";
import { DataProvider } from "@/app/context/DataProvider";

const Page = () => {
  return (
    <div>
      <DataProvider>
        <ActionPage />
      </DataProvider>
    </div>
  );
};

export default Page;
