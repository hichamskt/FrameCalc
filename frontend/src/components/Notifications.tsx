import { useCallback, useEffect, useRef } from "react";

import type { AppNotification } from "../types/app";
import { clearNotification } from "../services/Notifications/NotificationService";
import { useAxios } from "../api/axios";

type NotificationHookReturn = {
  notif: AppNotification[];
  Loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  next: string | null;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
};

type NotificationProps = {
  notifications: AppNotification[];
  clearNotifications: () => void;
  setNotifCount: React.Dispatch<React.SetStateAction<number>>;
  setDropNotifications: React.Dispatch<React.SetStateAction<boolean>>;
  notificationHook: NotificationHookReturn;
  allNotification: AppNotification[];
setAllNotification: React.Dispatch<React.SetStateAction<AppNotification[]>>;
};

const Notifications = ({
  setNotifCount,
  setDropNotifications,
  
  clearNotifications,
  notificationHook,
  allNotification,
  setAllNotification
}: NotificationProps) => {
  
  const {  Loading, setLoading, next, setRefresh } = notificationHook;
  
  const observerRef = useRef<HTMLDivElement | null>(null);
  const axios = useAxios();

 




  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  

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
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    if (diffInHours < 1) {
      const minutes = Math.floor(diffInHours * 60);
      return `${minutes}m ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];

      if (target.isIntersecting && next && !Loading) {
        setLoading(true);
        setRefresh(true);
      }
    },
    [next, Loading, setLoading, setRefresh]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: "2px",
      threshold: 0,
    });

    if (observerRef.current) observer.observe(observerRef.current);

    return () => observer.disconnect();
  }, [handleObserver]);

  const unreadCount = allNotification.filter((n) => !n.is_read).length;

  const cleareNotifications = async () => {
    try {
      await clearNotification(axios);
    } catch (error) {
      console.error("Failed to cleare notif:", error);
    }
  };

  const handleClear = () => {
    clearNotifications();
    setAllNotification([]);
    setNotifCount(0);
    cleareNotifications();
  };

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setDropNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setDropNotifications]);

  return (
    <div
      className="absolute top-12 right-0 bg-white sm:w-96 w-full rounded-xl shadow-xl border border-gray-200 z-50"
      ref={menuRef}
    >
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        <button
          onClick={handleClear}
          className="px-3 py-1.5 text-sm bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Clear All
        </button>
      </div>

      {/* Notifications List */}
      <div className="max-h-96 overflow-y-auto">
        {allNotification.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <div className="text-4xl mb-2">📬</div>
            <p className="text-sm">No notifications yet</p>
            <p className="text-xs text-gray-400 mt-1">You're all caught up!</p>
          </div>
        ) : (
          <div>
            {allNotification.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 border-b border-gray-50 last:border-b-0 transition-all hover:bg-gray-50 ${
                  !notification.is_read
                    ? "bg-blue-50/50 border-l-4 border-l-blue-500"
                    : "bg-white"
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <div className="flex-shrink-0 mt-0.5">
                    <span className="text-lg">
                      {getNotificationIcon(
                        notification.type ||
                          notification.notification_type ||
                          ""
                      )}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-gray-900 text-sm truncate">
                        {notification.sender_username || notification.sender}
                      </span>
                      <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 rounded-md uppercase">
                        {notification.type || notification.notification_type}
                      </span>
                      {!notification.is_read && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                      )}
                    </div>

                    <p className="text-gray-700 text-sm mb-2 leading-relaxed">
                      {notification.message}
                    </p>

                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <svg
                          className="w-3 h-3"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {formatTimestamp(
                          notification.timestamp ||
                            notification.created_at ||
                            ""
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
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                          Post
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
                          Reply
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Loading/Pagination */}
            <div ref={observerRef} className="text-center text-gray-500 py-4">
              {Loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                  <span className="text-sm">Loading more...</span>
                </div>
              ) : next ? (
                <span className="text-sm text-gray-400">Scroll for more</span>
              ) : (
                <span className="text-sm text-gray-400">
                  You're all caught up!
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
