"use client";
import React, { createContext, useContext, useState } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { Button } from "@mui/material";
import { AdminDataContext } from "@/app/context/AdminDataContext";
import { CategoryContextData } from "@/app/context/CategoryDataContext";
import { BillContextData } from "@/app/context/OrderContextData";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export const ModalContext = createContext({
  handleOpen: () => {},
  handleClose: () => {},
  setTitle: () => {},
  setContent: () => {},
  setMode: () => {},
});

export const GeneralModal = ({
  title,
  content,
  open,
  handleClose,
  handleSubmit,
  handleDelete,
  handleCallback,
  mode,
}) =>
  mode === "announce" ? (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box className="absolute left-1/2 top-1/2 h-auto w-[600px] -translate-x-1/2 -translate-y-1/2 transform rounded-[20px] bg-white p-4 shadow-lg">
        <Box
          className={"text-center text-lg font-bold uppercase text-gray-600"}
          id="modal-modal-title"
          variant="h6"
          component="h2"
        >
          {title}
        </Box>
        <Box
          className={"flex h-auto flex-col gap-6 p-5"}
          id="modal-modal-description"
          sx={{ mt: 2 }}
        >
          {content}
          <div className={"flex justify-evenly"}>
            <Button
              onClick={() => {
                handleDelete();
                handleClose();
              }}
              variant="contained"
              className={
                " w-1/3 self-center bg-cyan-500 uppercase hover:bg-teal-800 "
              }
            >
              Yes
            </Button>
            <Button
              onClick={handleClose}
              variant="contained"
              className={
                "w-1/3 self-center bg-gray-500 uppercase hover:bg-teal-800 "
              }
            >
              Cancel
            </Button>
          </div>
        </Box>
      </Box>
    </Modal>
  ) : (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box className="absolute left-1/2 top-1/2 h-auto w-[600px] -translate-x-1/2 -translate-y-1/2 transform rounded-[20px] bg-white p-4 shadow-lg">
        <Box
          className={"text-center text-lg font-bold uppercase text-gray-600"}
          id="modal-modal-title"
          variant="h6"
          component="h2"
        >
          {title}
        </Box>
        <Box
          className={"flex h-auto flex-col gap-6 p-5"}
          id="modal-modal-description"
          sx={{ mt: 2 }}
        >
          {content}
          <div className={"flex justify-evenly"}>
            <Button
              onClick={async (e) => {
                await handleSubmit(
                  e,
                  mode?.toLowerCase() === "add" ? "create" : "update",
                );
                if (handleCallback) handleCallback();
                handleClose(); // Đóng modal sau khi xử lý
              }}
              variant="contained"
              className={
                " w-1/3 self-center bg-cyan-500 uppercase hover:bg-teal-800 "
              }
            >
              {mode?.toLowerCase() === "add" ? "Add" : "Update"}
            </Button>
            <Button
              onClick={handleClose}
              variant="contained"
              className={
                "w-1/3 self-center bg-gray-500 uppercase hover:bg-teal-800 "
              }
            >
              {"Close"}
            </Button>
          </div>
        </Box>
      </Box>
    </Modal>
  );
// product
export const AnnounceModalProvider = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("Default Title");
  const [content, setContent] = useState("Default Content");
  const [handleDelete, setHandleDelete] = useState();

  const [mode, setMode] = useState("");
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  return (
    <ModalContext.Provider
      value={{
        handleOpen,
        handleClose,
        setTitle,
        setContent,
        setHandleDelete,
        setMode,
      }}
    >
      {children}
      <GeneralModal
        title={title}
        content={content}
        open={open}
        handleClose={handleClose}
        handleDelete={handleDelete}
        mode={mode}
      />
    </ModalContext.Provider>
  );
};

// users
export const UserModalProvider = ({ children }) => {
  const { handleSubmit } = useContext(AdminDataContext);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("Default Title");
  const [content, setContent] = useState("Default Content");
  const [mode, setMode] = useState("add");
  const [handleCallback, setHandleCallback] = useState();
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <ModalContext.Provider
      value={{
        handleOpen,
        handleClose,
        setTitle,
        setContent,
        setMode,
        setHandleCallback,
      }}
    >
      {children}
      <GeneralModal
        title={title}
        content={content}
        open={open}
        handleClose={handleClose}
        handleSubmit={handleSubmit}
        handleCallback={handleCallback}
        mode={mode}
      />
    </ModalContext.Provider>
  );
};

// And do the same for CategoryModalProvider
export const CategoryModalProvider = ({ children }) => {
  const { handleSubmit, setDropdownCategories } =
    useContext(CategoryContextData);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("Default Title");
  const [content, setContent] = useState("Default Content");
  const [mode, setMode] = useState("add");
  const [handleCallback, setHandleCallback] = useState();
  const [handleDelete, setHandleDelete] = useState();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <ModalContext.Provider
      value={{
        handleOpen,
        handleClose,
        setTitle,
        setContent,
        setMode,
        setDropdownCategories,
        setHandleCallback,
        setHandleDelete,
      }}
    >
      {children}
      <GeneralModal
        title={title}
        content={content}
        open={open}
        handleClose={handleClose}
        handleSubmit={handleSubmit}
        handleDelete={handleDelete}
        handleCallback={handleCallback}
        mode={mode}
      />
    </ModalContext.Provider>
  );
};

export const BillModalProvider = ({ children }) => {
  const { handleSubmit, setDropdownStatus } = useContext(BillContextData);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("Default Title");
  const [content, setContent] = useState("Default Content");
  const [mode, setMode] = useState("add");
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <ModalContext.Provider
      value={{
        handleOpen,
        handleClose,
        setTitle,
        setContent,
        setMode,
        setDropdownStatus,
      }}
    >
      {children}
      <GeneralModal
        title={title}
        content={content}
        open={open}
        handleClose={handleClose}
        handleSubmit={handleSubmit}
        mode={mode}
      />
    </ModalContext.Provider>
  );
};
