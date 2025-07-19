import { Outlet } from "react-router-dom";
import SideBar from "../components/SideBar";
import { IoIosNotifications } from "react-icons/io";

function Layout() {
  return (
    <div className=" bg-[#081028] ">
      <div className=" text-white text-2xl flex justify-end container p-3">
        <IoIosNotifications />
      </div>
      <div className="flex gap-2 ">
        <SideBar />
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;
