"use client";
import React, { useContext } from "react";
import InputDataForAdmin from "@/app/admins/(component)/InputDataForAdmin";
import { ModalContext } from "@/app/context/ModalContext";

// for add new
export const adminAddContent = () => {
  return (
    <>
      <InputDataForAdmin
        title={"firstName"}
        modeName={"add"}
        showTitle={"first name"}
      />
      <InputDataForAdmin
        title={"lastName"}
        modeName={"add"}
        showTitle={"last name"}
      />
      <InputDataForAdmin title={"email"} modeName={"add"} showTitle={"email"} />
      <InputDataForAdmin
        title={"password"}
        modeName={"add"}
        showTitle={"password"}
      />
    </>
  );
};
export const adminUpdateContent = (prevData) => {
  return (
    <>
      <InputDataForAdmin
        title={"firstName"}
        modeName={"update"}
        showTitle={"first name"}
        defaultValue={prevData.firstName}
      />
      <InputDataForAdmin
        title={"lastName"}
        modeName={"update"}
        showTitle={"last name"}
        defaultValue={prevData.lastName}
      />
      <InputDataForAdmin
        title={"email"}
        modeName={"update"}
        showTitle={"email"}
        defaultValue={prevData.email}
      />
      <InputDataForAdmin
        title={"currentPassword"}
        modeName={"update"}
        showTitle={"current Password"}
      />
      <InputDataForAdmin
        title={"newPassword"}
        modeName={"update"}
        showTitle={"new Password"}
      />
      <InputDataForAdmin
        title={"confirmationPassword"}
        modeName={"update"}
        showTitle={"confirmation Password"}
      />
    </>
  );
};
export default function AddButton({ callback, buttonName }) {
  const { handleOpen, setTitle, setContent, setHandleCallback } =
    useContext(ModalContext);
  // add new
  const adminCustomModal = () => {
    setTitle("Add new Admin");
    setContent(adminAddContent);
    handleOpen();
    setHandleCallback(() => callback);
  };
  return (
    <div className={"ml-[10px] h-[50px]"}>
      {/*<Button*/}
      {/*  variant="soft"*/}
      {/*  color="neutral"*/}
      {/*  onClick={() => {*/}
      {/*    setVariant("soft");*/}
      {/*  }}*/}
      {/*  className="mb-4 rounded-[10px] bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"*/}
      {/*>*/}
      {/*  Add new product*/}
      {/*</Button>*/}
      {/*<BasicModal variant={variant} setVariant={setVariant} />*/}
      {
        <div
          className={`mb-4 w-[200px] cursor-pointer rounded-[10px] bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700`}
          onClick={adminCustomModal}
        >
          {buttonName}
        </div>
      }
    </div>
  );
}
