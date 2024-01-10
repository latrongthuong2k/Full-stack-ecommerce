import React from "react";

const CheckOutPage = () => {
  return (
    <div className={"pt-8"}>
      <p className={"mb-4 text-3xl"}>購入手続き</p>
      <p className={"mb-4"}>
        通常商品（UNIQLO
        FLOWERを除く）は、¥4,990以上のお買い物または「店舗受取り」の場合は送料無料です。
      </p>
      <hr className={"mb-4"} />
      <p className={"mb-4"}>指定住所受取り</p>
      <div className={"mb-6"}>
        {/*  address and user Info  */}
        <p>ten</p>
        <p>address</p>
        <p>phone</p>
      </div>
      <hr className={"mb-3"} />
      <p className={"mb-4"}>配送予定日</p>
      <p className={"mb-4"}>配送日時: 2024/1/7 〜 2024/1/8</p>
      <hr className={"mb-4"} />
    </div>
  );
};

export default CheckOutPage;
