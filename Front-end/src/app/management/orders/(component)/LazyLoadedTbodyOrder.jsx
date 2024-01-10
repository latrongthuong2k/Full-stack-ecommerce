import React, { useContext } from "react";
import EditNoteTwoToneIcon from "@mui/icons-material/EditNoteTwoTone";
import { tdRender } from "@/app/products/(components)/ProductPage";
import { ModalContext } from "@/app/context/ModalContext";
import { getBillById } from "@/services/OrdersService";
import DropdownOrderStatus from "@/app/orders/(component)/DropdownOrderStatus";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const LazyLoadedTableBody = ({ handle, bills }) => {
  const { handleOpen, setTitle, setContent, setMode } =
    useContext(ModalContext);
  const { replace } = useRouter();
  const pathName = usePathname();
  const searchParams = new useSearchParams();
  const params = new URLSearchParams(searchParams);

  const getBillId = async (id) => {
    const orderDataById = await getBillById(id);
    orderCustomModal(orderDataById.data); // bill
    // console.log(orderDataById.data);
    params.set("billId", id);
    replace(`${pathName}?${params}`);
  };

  function formatDate(dateString) {
    return dateString?.split("T")[0];
  }

  const orderCustomModal = (data) => {
    setTitle("Edit bill status ");
    setContent(orderUpdateContent(data));
    handleOpen();
    setMode("update");
  };
  const orderUpdateContent = (data) => {
    return (
      <>
        <DropdownOrderStatus
          title={"status"}
          showTitle={"Bill status"}
          defaultValue={data}
        />
      </>
    );
  };
  const tdRenderStatus = (attribute) => {
    // Xác định style dựa trên trạng thái
    const statusStyle = (status) => {
      switch (status) {
        case "APPROVE":
          return "bg-green-300 text-green-700";
        case "CANCEL":
          return "bg-red-300 text-red-700";
        case "PENDING":
          return "bg-yellow-300 text-yellow-700";
        case "DELIVERING":
          return "bg-blue-300 text-blue-700";
        case "RECEIVED":
          return "bg-purple-300 text-purple-700";
      }
    };

    return (
      <td className="whitespace-nowrap p-5">
        <div
          className={`flex items-center justify-center rounded-[20px] border p-1 ${statusStyle(
            attribute,
          )}`}
        >
          <div className="font-medium">{attribute}</div>
        </div>
      </td>
    );
  };

  return (
    <tbody className="divide-y divide-gray-100 text-sm">
      {bills.map((bill) => (
        <tr key={bill.id}>
          {tdRender(bill.id)}
          {tdRender(
            bill.createdDate ? formatDate(bill.createdDate) : "No change",
          )}
          {tdRender(
            bill.approvedDate ? formatDate(bill.approvedDate) : "No change",
          )}
          {tdRender(bill.createdBy)}
          {tdRender(bill.approvedBy ? bill.approvedBy : "No change")}
          {tdRenderStatus(bill.billStatus)}
          <td className="flex justify-center whitespace-nowrap p-2">
            <button
              className={
                "mr-2 rounded-[20px] border-4 px-4 py-2 text-violet-400 hover:border-violet-300 hover:text-violet-600"
              }
              onClick={() => getBillId(bill.id)}
            >
              <EditNoteTwoToneIcon />
              Edit
            </button>
            <button
              onClick={() => handle(bill.id)}
              className="rounded-[20px] border-4 px-4 py-2 text-red-400 hover:border-red-300 hover:text-red-600"
            >
              Cancel
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  );
};

export default LazyLoadedTableBody;
