import { Outlet } from "react-router-dom";
import SideBar from "../components/SideBar";
import { IoIosNotifications } from "react-icons/io";
import Notifications from "../components/Notifications";
import { useState } from "react";



function Layout() {
const [notificationCount,setNotifCount]= useState<number>(0)



  return (
    <div className=" bg-[#081028] ">
      <div className=" text-white text-2xl flex justify-end container p-3">
        <div className="relative">
        <IoIosNotifications />
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] min-w-[16px] h-4 px-[4px] flex items-center justify-center rounded-full leading-none">{notificationCount}</span>
        <Notifications setNotifCount={setNotifCount} />
        </div>
      </div>
      <div className="flex gap-2 ">
        <SideBar />
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;
