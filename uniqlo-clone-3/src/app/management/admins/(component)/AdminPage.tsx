"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { CircularProgress } from "@mui/joy";

const LazyLoadedTableBody = dynamic(() => import("./LazyLoadedTbodyAdmins"), {
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

const AdminPage: React.FC<UserTableProps> = ({ searchParams, targetProps }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [totalPage, setTotalPage] = useState<number>(0);
  const q = searchParams?.q || "";
  const page = searchParams?.page || 1;
  const sortField = searchParams?.sortField || "firstName";
  const sortDir = searchParams?.sortDir || "asc";
  const [isDelete, setIsDelete] = useState(false);
  const [isCreate, setIsCreate] = useState(false);
  // @ts-ignore
  const { showNotification } = useNotification();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersPage = await fetchPageAdmin(q, page, 10, sortField, sortDir);
        if (usersPage) {
          setTotalPage(usersPage.data.totalPages);
          setUsers(usersPage.data.users);
        }
      } catch (error) {
        showNotification("error", "Error fetching users:", error);
      }
    };
    fetchData();
  }, [isCreate, isDelete, page, q, showNotification, sortDir, sortField]);
  // handle delete
  const handleDelete = async (userId: number) => {
    try {
      const res = await deleteUser(userId);
      if (res.success) showNotification("success", res.data);
      else showNotification("error", res.err);
      setIsDelete((prev) => !prev);
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleReload = () => {
    setIsCreate((prev) => !prev);
  };

  return (
    <div className="container mx-auto mt-14">
      <AddButton callback={handleReload} buttonName={"Add new admin user"} />
      <div className="flex justify-between">
        <Search />
        <SortBar
          optionProps={[
            <MenuItem value="firstName" key="firstName">
              First name
            </MenuItem>,
            <MenuItem value="lastName" key="lastName">
              Last name
            </MenuItem>,
            <MenuItem value="email" key="email">
              Email
            </MenuItem>,
            <MenuItem value="createdAt" key="createdAt">
              Created at
            </MenuItem>,
          ]}
          defaultSortField={"firstName"}
        />
      </div>
      {/*Khung table */}
      <div className="overflow-x-auto rounded-[20px] border-4 bg-gray-50 pb-6 shadow-lg">
        {/*Table */}
        <table className="w-full table-auto">
          <thead>
            <tr className="mb-[5px] rounded bg-teal-800 text-center text-lg font-semibold uppercase text-white">
              {thRender("ID")}
              {thRender("First Name")}
              {thRender("Last Name")}
              {thRender("Email")}
              {thRender("Created At")}
              {thRender("Updated At")}
              {thRender("Actions")}
            </tr>
          </thead>
          {/*T-Body*/}
          <LazyLoadedTableBody handle={handleDelete} users={users} />
        </table>
      </div>
      <div className={"ml-2 mt-6"}>
        <PaginationTable totalPage={totalPage} />
      </div>
    </div>
  );
};

export default AdminPage;
