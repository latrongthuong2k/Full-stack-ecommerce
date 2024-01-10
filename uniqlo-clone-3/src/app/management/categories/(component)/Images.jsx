import React, { useContext, useEffect, useState } from "react";
import Image from "next/image";
import MyDropzone from "@/app/products/(components)/MyDropzone";

import { DtoContext } from "@/app/context/DataProvider";
import HighlightOffRoundedIcon from "@mui/icons-material/HighlightOffRounded";
import { CircularProgress } from "@mui/joy";

const ImagesComponent = ({
  imageLoading,
  targetId,
  serverImageUrl,
  setReloadFlag,
}) => {
  const { handleDeleteImageFromServer, filesInfo, deleteFileById } =
    useContext(DtoContext);

  const enhancedDeleteImagesFromServer = (productId, awsUrl) => {
    handleDeleteImageFromServer(productId, awsUrl);
    setReloadFlag((prev) => !prev);
  };
  const [imageCoreLoading, setLoading] = useState(false);

  function handleImageLoaded() {
    setLoading(false);
  }

  useEffect(() => {}, [filesInfo]);
  const ImageDiv = (
    image,
    index,
    targetAction,
    deleteFileById,
    enhancedDeleteImagesFromServer,
  ) => {
    // console.log(url);
    // console.log(key);
    let clientGenerateImageUrl = "";
    let clientGenerateKey = "";
    if (targetAction === "fileInfo") {
      clientGenerateImageUrl = image.url;
      clientGenerateKey = image.id;
    }
    return (
      <div
        key={index}
        className=" h-[13rem] w-[11rem] rounded-[10px] border-2 border-gray-300  bg-gray-300 p-2 hover:border-violet-300"
      >
        <button className={"relative  mb-1 h-[10rem] w-[10rem]"}>
          <Image
            className="rounded-[8px]"
            src={targetAction === "oldImage" ? image : clientGenerateImageUrl}
            alt={`Image ${index}`}
            quality={100}
            layout="fill"
            objectFit="cover"
            onLoad={handleImageLoaded}
          />
        </button>
        <div
          onClick={() => {
            targetAction === "fileInfo"
              ? deleteFileById(clientGenerateKey)
              : enhancedDeleteImagesFromServer(targetId, image);
          }}
          className={
            " flex justify-center rounded-[10px] bg-red-300 py-[2px] text-gray-600 hover:cursor-pointer"
          }
        >
          <HighlightOffRoundedIcon />
        </div>
      </div>
    );
  };

  return (
    <div className="mb-7 h-auto w-full rounded-[18px] bg-gray-600 p-[14px]">
      <div className="mb-2 block text-xs font-bold uppercase tracking-wide text-white">
        Photos
      </div>
      <div className="flex flex-wrap gap-3">
        {imageLoading || imageCoreLoading ? (
          <div
            className={
              "flex h-[13rem] w-[11rem] items-center justify-center rounded-[10px] border-2 border-gray-300  bg-gray-300 p-2"
            }
          >
            <CircularProgress />
          </div>
        ) : (
          <>
            {serverImageUrl.length > 0 &&
              serverImageUrl.map((url, index) => {
                return ImageDiv(
                  url,
                  index,
                  "oldImage",
                  deleteFileById,
                  enhancedDeleteImagesFromServer,
                );
              })}
            {filesInfo &&
              filesInfo.map((image, index) => {
                return ImageDiv(
                  image,
                  index,
                  "fileInfo",
                  deleteFileById,
                  enhancedDeleteImagesFromServer, // not delete from server
                );
              })}
          </>
        )}

        <MyDropzone />
      </div>
    </div>
  );
};

export default ImagesComponent;
