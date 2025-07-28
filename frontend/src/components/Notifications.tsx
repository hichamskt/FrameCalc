import { useEffect, useState } from "react";
import { usePostNotifSocket } from "../sockets/usePostNotifSocket";
import { UseNotification } from "../hooks/notification/UseNotification";
import { AppNotification } from "../types/app";

type NotificationProps = {
  setNotifCount: React.Dispatch<React.SetStateAction<number>>;
};

const Notifications = ({ setNotifCount }: NotificationProps) => {
  const { notifications, clearNotifications } = usePostNotifSocket(
    "e04fdae3-5042-4491-8ddd-7c5e629ce36b"
  );
  const { notif, Loading, next, setRefresh } = UseNotification();
  const [allNotification, setAllNotification] = useState<AppNotification[]>([]);

  useEffect(() => {
    setAllNotification((prev) => {
      
      const combined = [ ...prev, ...notif];

     
      const uniqueMap = new Map<string, AppNotification>();
      for (const n of combined) {
        uniqueMap.set(n.id, n);
      }

      return Array.from(uniqueMap.values());
    });
  }, [notif]);

  useEffect(() => {
  if (notifications.length > 0) {
    setAllNotification((prev) => [...notifications, ...prev]);
  }
}, [notifications]);

  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    setNotifCount(notifications.length);
  }, [notifications, setNotifCount]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "comment":
        return "💬";
      case "like":
        return "❤️";
      case "info":
        return "ℹ️";
      default:
        return "📬";
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  console.log(allNotification);

  return (
    <div className="mb-6 absolute top-6 right-[-30px]   bg-white w-[500px] rounded-2xl">
      <div className="flex justify-between items-center mb-4 p-2">
        <h3 className="text-lg font-semibold text-gray-700">
          Notifications ({notif.length})
        </h3>
        <button
          onClick={clearNotifications}
          className="px-4 py-2 text-sm bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
        >
          Clear All
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 max-h-96 overflow-y-auto">
        {notif.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <div className="text-4xl mb-2">📬</div>
            <p>No notifications yet. Waiting for messages...</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {allNotification.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 transition-colors hover:bg-gray-50 ${
                  notification.is_read
                    ? "bg-white"
                    : "bg-blue-50 border-l-4 border-blue-500"
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-xl flex-shrink-0 mt-1">
                    {getNotificationIcon(
                      notification.type || notification.notification_type
                    )}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-blue-600 truncate text-[16px]">
                        {notification.sender_username || notification.sender }
                      </span>
                      <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full uppercase tracking-wide">
                        {notification.type}
                      </span>
                      {!notification.is_read && (
                        <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0"></div>
                      )}
                    </div>
                    <p className="text-gray-800 text-sm leading-relaxed mb-2">
                      {notification.message}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        {formatTimestamp(
                          notification.timestamp || notification.created_at
                        )}
                      </span>
                      {(notification.post_id || notification.post) && (
                        <span className="flex items-center gap-1">
                          <svg
                            className="w-3 h-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h4a1 1 0 110 2h-1v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6H3a1 1 0 110-2h4z"
                            />
                          </svg>
                          Post: {notification.post_id || notification.post}
                        </span>
                      )}

                      {notification.comment_id && (
                        <span className="flex items-center gap-1">
                          <svg
                            className="w-3 h-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                            />
                          </svg>
                          Comment: {notification.comment_id}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
