import React from "react";
import { AdminDataProvider } from "@/app/context/AdminDataContext";
import { UserModalProvider } from "@/app/context/ModalContext";
import AdminPage from "@/app/admins/(component)/AdminPage";

const Page = ({ searchParams }) => {
  return (
    <section>
      <AdminDataProvider>
        <UserModalProvider>
          <AdminPage searchParams={searchParams} />
        </UserModalProvider>
      </AdminDataProvider>
    </section>
  );
};

export default Page;
