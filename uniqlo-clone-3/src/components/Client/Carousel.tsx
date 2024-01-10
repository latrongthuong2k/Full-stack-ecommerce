"use client";
import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { S3ProductImageDetail } from "@/lib/types";
import Loading from "@/app/loading";
type S3ImageCollection = {
  images: S3ProductImageDetail[];
};

const ImageCarousel: React.FC<S3ImageCollection> = ({ images }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadedImages, setLoadedImages] = useState(0); // Thêm state mới để theo dõi số lượng hình ảnh đã tải
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [emblaMainRef, emblaMainApi] = useEmblaCarousel();
  const [emblaThumbsRef, emblaThumbsApi] = useEmblaCarousel({
    containScroll: "keepSnaps",
    dragFree: true,
  });
  // const [emblaRef] = useEmblaCarousel({ loop: false }, [Autoplay()]);
  const [sortedImages, setSortedImages] = useState<S3ProductImageDetail[]>([]);

  const handleImageLoad = () => {
    setLoadedImages((prev) => prev + 1);
  };

  useEffect(() => {
    setLoadedImages(0);
    setIsLoading(true);

    const primaryImage = images.find((image) => image.isPrimary) || images[0];
    setSortedImages([
      primaryImage,
      ...images.filter((image) => image !== primaryImage),
    ]);
  }, [images]);
  //
  useEffect(() => {
    if (loadedImages === sortedImages.length) {
      setIsLoading(false);
    }
  }, [loadedImages, sortedImages.length]);

  useEffect(() => {
    const primaryImage = images.find((image) => image.isPrimary) || images[0];
    setSortedImages([
      primaryImage,
      ...images.filter((image) => image !== primaryImage),
    ]);
  }, [images]);

  const scrollPrev = useCallback(() => {
    if (emblaMainApi) emblaMainApi.scrollPrev();
  }, [emblaMainApi]);

  const scrollNext = useCallback(() => {
    if (emblaMainApi) emblaMainApi.scrollNext();
  }, [emblaMainApi]);

  const onThumbClick = useCallback(
    (index: number) => {
      if (!emblaMainApi || !emblaThumbsApi) return;
      emblaMainApi.scrollTo(index);
      setSelectedIndex(index);
    },
    [emblaMainApi, emblaThumbsApi],
  );

  useEffect(() => {
    if (!emblaMainApi || !emblaThumbsApi) return;

    const onSelect = () => {
      setSelectedIndex(emblaMainApi.selectedScrollSnap());
      emblaThumbsApi.scrollTo(emblaMainApi.selectedScrollSnap());
    };

    emblaMainApi.on("select", onSelect);
    emblaMainApi.on("reInit", onSelect);

    return () => {
      emblaMainApi.off("select", onSelect);
      emblaMainApi.off("reInit", onSelect);
    };
  }, [emblaMainApi, emblaThumbsApi]);

  return (
    <>
      <div className={"flex w-3/5 gap-5"}>
        <div className={"w-20 "}>
          <div>{isLoading && <Loading />}</div>
          <div className="flex overflow-x-auto " ref={emblaThumbsRef}>
            <div className="flex flex-col">
              {sortedImages.map((image, index) => (
                <div
                  key={image.key}
                  className={`cursor-pointer p-1 ${
                    selectedIndex === index ? "border-2 border-gray-800" : ""
                  }`}
                  onClick={() => onThumbClick(index)}
                >
                  <Image
                    src={image.url}
                    alt={`Thumbnail ${index}`}
                    width={10}
                    height={10}
                    style={{ width: "auto" }}
                    layout="responsive"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        {isLoading ? (
          <Loading />
        ) : (
          <div className="relative w-full overflow-hidden" ref={emblaMainRef}>
            <div className="flex">
              {sortedImages.map((image, index) => (
                <div key={image.key} className="min-w-full">
                  <Image
                    src={image.url}
                    alt={`Slide ${index}`}
                    width={500}
                    height={300}
                    style={{ width: "auto" }}
                    layout="responsive"
                    onLoad={handleImageLoad}
                  />
                </div>
              ))}
            </div>
            <button
              className="absolute left-[0.01px] top-1/2 z-10 -translate-y-1/2 transform cursor-pointer border-none bg-white p-2 text-xl"
              onClick={scrollPrev}
            >
              <IoIosArrowBack />
            </button>
            <button
              className="absolute right-[0.01px] top-1/2 z-10 -translate-y-1/2 transform cursor-pointer border-none bg-white p-2 text-xl"
              onClick={scrollNext}
            >
              <IoIosArrowForward />
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default ImageCarousel;
