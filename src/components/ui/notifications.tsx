"use client";

import { useNotifications } from "@/app/providers";
import { XIcon } from "lucide-react";
import { cva } from "class-variance-authority";
import { useEffect } from "react";

const notificationVariants = cva(
  "flex justify-between items-center p-4 rounded-md shadow-md transition-opacity mb-2",
  {
    variants: {
      type: {
        success: "bg-green-100 text-green-800 border-l-4 border-green-500",
        error: "bg-red-100 text-red-800 border-l-4 border-red-500",
        info: "bg-blue-100 text-blue-800 border-l-4 border-blue-500",
      },
    },
    defaultVariants: {
      type: "info",
    },
  }
);

export function Notifications() {
  const { notifications, removeNotification } = useNotifications();

  // Auto-dismiss notifications after 5 seconds
  useEffect(() => {
    const timers = notifications.map((notification) => {
      return setTimeout(() => {
        removeNotification(notification.id);
      }, 5000);
    });

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [notifications, removeNotification]);

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 max-w-md w-full space-y-2">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={notificationVariants({ type: notification.type })}
          role="alert"
        >
          <div>
            <h3 className="font-medium">{notification.title}</h3>
            {notification.description && (
              <p className="text-sm mt-1">{notification.description}</p>
            )}
          </div>
          <button
            onClick={() => removeNotification(notification.id)}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close notification"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>
      ))}
    </div>
  );
}
