"use client";
import React, { useCallback, useContext } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { DtoContext } from "@/app/context/DataProvider";

export default function MyDropzone() {
  const { addFile } = useContext(DtoContext);
  const onDrop = useCallback(
    (acceptedFiles) => {
      acceptedFiles.forEach((file) => {
        addFile(file);
      });
    },
    [addFile],
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
  return (
    <div
      className={
        "flex w-[12rem] items-center justify-center rounded-[8px] border-2 bg-gray-300 " +
        " border-gray-300 hover:border-violet-300 "
      }
      {...getRootProps()}
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <Image
          className={"items-center"}
          src={"/upload_Drag.png"}
          alt={"upload"}
          width={100}
          height={100}
        />
      ) : (
        <Image src={"/upload_i.png"} alt={"upload"} width={100} height={100} />
      )}
    </div>
  );
}
