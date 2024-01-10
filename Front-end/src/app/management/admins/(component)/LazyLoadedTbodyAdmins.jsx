import React, { useContext } from "react";
import EditNoteTwoToneIcon from "@mui/icons-material/EditNoteTwoTone";
import { tdRender } from "@/app/products/(components)/ProductPage";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ModalContext } from "@/app/context/ModalContext";
import { getUserById } from "@/services/AdminService";
import { adminUpdateContent } from "@/app/admins/(component)/AddButton";

const LazyLoadedTableBody = ({ handle, users }) => {
  const { handleOpen, setTitle, setContent, setMode } =
    useContext(ModalContext);
  const { replace } = useRouter();
  const pathName = usePathname();
  const searchParams = new useSearchParams();
  const params = new URLSearchParams(searchParams);
  const getUserId = async (id) => {
    const userDataById = await getUserById(id);
    userCusTomModal(userDataById.data);
    // console.log(userDataById.data);
    params.set("userId", id);
    replace(`${pathName}?${params}`);
  };
  function formatDate(dateString) {
    return dateString?.split("T")[0];
  }
  const userCusTomModal = (data) => {
    setTitle("Edit admin");
    setContent(adminUpdateContent(data));
    handleOpen();
    setMode("update");
  };
  return (
    <tbody className="divide-y divide-gray-100 text-sm">
      {users.map((user) => (
        <tr key={user.id}>
          {tdRender(user.id)}
          {tdRender(user.firstName)}
          {tdRender(user.lastName)}
          {tdRender(user.email)}
          {tdRender(formatDate(user.createdAt))}
          {tdRender(user.updatedAt ? formatDate(user.updatedAt) : "No change")}
          <td className="flex justify-center whitespace-nowrap p-2">
            <button
              className={
                "mr-2 rounded-[20px] border-4 px-4 py-2 text-violet-400 hover:border-violet-300 hover:text-violet-600"
              }
              onClick={() => getUserId(user.id)}
            >
              <EditNoteTwoToneIcon />
              Edit
            </button>
            <button
              onClick={() => handle(user.id)}
              className="rounded-[20px] border-4 px-4 py-2 text-red-400 hover:border-red-300 hover:text-red-600"
            >
              Delete
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  );
};

export default LazyLoadedTableBody;
