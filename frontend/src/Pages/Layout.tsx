import { Outlet } from "react-router-dom";
import SideBar from "../components/SideBar";
import { IoIosNotifications } from "react-icons/io";
import Notifications from "../components/Notifications";
import { useEffect, useState } from "react";
import { usePostNotifSocket } from "../sockets/usePostNotifSocket";
import { UseNotification } from "../hooks/notification/UseNotification";
import type { AppNotification } from "../types/app";



function Layout() {
const [notificationCount,setNotifCount]= useState<number>(0)
const [dropNotification,setDropNotifications]=useState<boolean>(false);
const notificationHook = UseNotification();
const [allNotification, setAllNotification] = useState<AppNotification[]>([]);
const { notifications, clearNotifications } = usePostNotifSocket(
    "e04fdae3-5042-4491-8ddd-7c5e629ce36b"
  );
  
  useEffect(() => {
      setNotifCount(allNotification.length);
    }, [setNotifCount,allNotification]);
    

     useEffect(() => {
    if (!notificationHook.notif || notificationHook.notif.length === 0) return;
    setAllNotification((prev) => {
      const combined = [...prev, ...notificationHook.notif];
      const uniqueMap = new Map<number, AppNotification>();
      for (const n of combined) {
        uniqueMap.set(n.id, n);
      }
      return Array.from(uniqueMap.values());
    });
  }, [notificationHook.notif, notificationHook.next]);


   useEffect(() => {
  if (notifications.length > 0) {
    setAllNotification((prev) => {
      const combined = [...notifications, ...prev];
      const uniqueMap = new Map<number, AppNotification>();

      for (const notif of combined) {
        uniqueMap.set(notif.id, notif);
      }

      return Array.from(uniqueMap.values());
    });
  }
}, [notifications , notificationHook.notif  ]);

  return (
    <div className=" bg-[#081028] ">
      <div className=" text-white text-2xl  p-3">
        <div className="relative w-full flex justify-end">
        <IoIosNotifications className="cursor-pointer"  onClick={()=>setDropNotifications(true)}/>
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] min-w-[16px] h-4 px-[4px] flex items-center justify-center rounded-full leading-none">{notificationCount}</span>
        {dropNotification &&  <Notifications setNotifCount={setNotifCount} setDropNotifications={setDropNotifications} notifications={notifications} allNotification={allNotification} setAllNotification={setAllNotification} clearNotifications={clearNotifications} notificationHook={notificationHook} />}
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
