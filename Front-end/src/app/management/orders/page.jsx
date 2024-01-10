import React from "react";
import { BillModalProvider } from "@/app/context/ModalContext";
import BillPage from "@/app/orders/(component)/BillPage";
import { BillDataProvider } from "@/app/context/OrderContextData";

const Page = ({ searchParams }) => {
  return (
    <section>
      <BillDataProvider>
        <BillModalProvider>
          <BillPage searchParams={searchParams} />
        </BillModalProvider>
      </BillDataProvider>
    </section>
  );
};

export default Page;
