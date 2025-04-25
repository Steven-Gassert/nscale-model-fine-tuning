"use client";

import {
  isServer,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactNode, createContext, useContext, useState } from "react";

export type NotificationType = "success" | "error" | "info";

export interface Notification {
  id: string;
  title: string;
  description?: string;
  type: NotificationType;
}

interface NotificationsContextType {
  notifications: Notification[];
  addNotification: (
    title: string,
    description?: string,
    type?: NotificationType
  ) => string;
  removeNotification: (id: string) => void;
}

const NotificationsContext = createContext<
  NotificationsContextType | undefined
>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (context === undefined) {
    throw new Error(
      "useNotifications must be used within a NotificationsProvider"
    );
  }
  return context;
};

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (
    title: string,
    description?: string,
    type: NotificationType = "info"
  ): string => {
    const id = crypto.randomUUID();
    setNotifications((prev) => [...prev, { id, title, description, type }]);
    return id;
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
  };

  return (
    <NotificationsContext.Provider
      value={{ notifications, addNotification, removeNotification }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // With SSR, we usually want to set some default staleTime
        // above 0 to avoid refetching immediately on the client
        staleTime: 60 * 1000,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

export function getQueryClient() {
  if (isServer) {
    // Server: always make a new query client
    return makeQueryClient();
  } else {
    // Browser: make a new query client if we don't already have one
    // This is very important, so we don't re-make a new client if React
    // suspends during the initial render. This may not be needed if we
    // have a suspense boundary BELOW the creation of the query client
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

export function Providers({ children }: { children: ReactNode }) {
  // NOTE: Avoid useState when initializing the query client if you don't
  //       have a suspense boundary between this and the code that may
  //       suspend because React will throw away the client on the initial
  //       render if it suspends and there is no boundary
  const queryClient = getQueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <NotificationsProvider>{children}</NotificationsProvider>
    </QueryClientProvider>
  );
}
