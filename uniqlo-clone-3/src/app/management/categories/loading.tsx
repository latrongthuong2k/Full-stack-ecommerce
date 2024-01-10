import React from "react";
import { CircularProgress } from "@mui/joy";

const Loading = () => {
  return (
    <div className={"flex justify-center p-5"}>
      <CircularProgress />
    </div>
  );
};

export default Loading;
