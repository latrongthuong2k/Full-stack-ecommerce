"use client";
import React, { useEffect, useState } from "react";
import { fetchUserDetailInfo } from "@/api/services/AuthService";

interface UserDetailInfo {
  userId: number;
  userName: string;
  email: string;
  fullName: string;
  phone: string;
  gender: string;
  userAddresses: UserAddress[];
}

type UserAddress = {
  id: number;
  isMainAddress: boolean;
  fullAddress: string;
  phone: string;
  receiveName: string;
};
const MemberDetailInfo = () => {
  const [userInfo, setUserInfo] = useState<UserDetailInfo>();
  useEffect(() => {
    const fetchUserInfo = async () => {
      const userInfo = await fetchUserDetailInfo();
      if (userInfo) {
        if (userInfo.error) {
          console.log(userInfo.error);
          throw new Error(userInfo.error || "Could not save.");
        } else {
          setUserInfo(userInfo.data);
        }
      }
    };
    fetchUserInfo();
  }, []);

  const handleGetMainAddress = (
    addresses: UserAddress[] | undefined,
  ): string => {
    const mainAddress = addresses?.find((address) => address.isMainAddress);
    return mainAddress ? mainAddress.fullAddress : "未登録";
  };
  const handleGetAddressNotIncludeMainAddress = (
    addresses: UserAddress[] | undefined,
  ): string => {
    const mainAddress = addresses?.find((address) => !address.isMainAddress);
    return mainAddress ? mainAddress.fullAddress : "";
  };
  return (
    <>
      <div className={"pt-10"}>
        <p className={"mb-6 text-3xl"}>会員情報詳細</p>
        <p className={"mb-4"}>
          こちらの内容はユニクロ・ジーユーで共通です。編集を行った場合はユニクロ・ジーユー双方のアカウントへ反映されます。
        </p>
        <hr className={"mb-6"} />
        <p className={"mb-6 text-3xl"}>会員メールアドレス</p>
        <p>メールアドレス</p>
        <p className={"mb-6"}>{userInfo?.email}</p>
        <hr className={"mb-6"} />
        <p className={"mb-6"}>会員情報詳細</p>
        <p>Name</p>
        <p className={"mb-6"}>{userInfo?.fullName}</p>
        <p>Address</p>
        <div>
          <p className={"my-3 flex justify-between pl-4"}>
            Main address : {handleGetMainAddress(userInfo?.userAddresses)}
            <button></button>
          </p>
          <hr className={"mb-3"} />
          <div className={"mb-3 pl-4"}>
            Subs address :
            {userInfo?.userAddresses.map((address) => (
              <p>
                {" "}
                {handleGetAddressNotIncludeMainAddress(userInfo?.userAddresses)}
              </p>
            ))}
          </div>
        </div>
        <hr className={"mb-6"} />
        <p>Phone number</p>
        <p className={"mb-6"}>{userInfo?.phone}</p>
        <p>Gender</p>
        <p className={"mb-6"}>{userInfo?.gender}</p>
      </div>
    </>
  );
};

export default MemberDetailInfo;
