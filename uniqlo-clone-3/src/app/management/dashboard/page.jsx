"use client";
import Image from "next/image";

const orders = [
  {
    title: "TODAY",
    num: 2,
    percent: 25,
    isIncrease: true,
    revenue: 200,
    prev: "vs yesterday",
  },
  {
    title: "This week",
    num: 30,
    percent: 14,
    isIncrease: true,
    revenue: 200,
    prev: "vs last weak",
  },
  {
    title: "This month",
    num: 30,
    percent: 14,
    isIncrease: true,
    revenue: 200,
    prev: "vs last month",
  },
];
const user = {
  userName: "Thuong",
  imageProfileUrl: "/next.svg",
};

const Card = ({ title, num, value, prev }) => (
  <div
    className="flex h-[250px] w-full flex-col items-center justify-between
  rounded-[6px] bg-white p-7 text-3xl uppercase shadow-md"
  >
    <span>{title}</span>
    <span className="text-4xl text-cyan-600">{num}</span>
    <span className="text-green-700">{value}</span>
    <span className="text-lg text-gray-500">{prev.toUpperCase()}</span>
  </div>
);
const Dashboard = () => {
  return (
    <div className="mr-[70px] mt-[50px] w-full">
      <header className="flex items-center justify-between pr-[10px]">
        <p className="uppercase">Dashboard</p>
        <div className="flex gap-[10px]">
          <p>{user.userName}</p>
          <Image
            src={user.imageProfileUrl}
            alt="imageProfile"
            width={100}
            height={100}
          />
        </div>
      </header>
      <section>
        <p className="mt-[20px] uppercase">Orders</p>
        <div className="mt-[40px] flex items-center justify-between gap-[20px]">
          {orders.map((item, index) => (
            <Card key={index} {...item} value={item.percent} />
          ))}
        </div>
        <p className="mt-[30px] uppercase">Revenue</p>
        <div className="mt-[40px] flex items-center justify-between gap-[20px]">
          {orders.map((item, index) => (
            <Card key={index} {...item} value={item.revenue} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
