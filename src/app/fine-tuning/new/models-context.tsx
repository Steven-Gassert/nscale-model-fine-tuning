"use client";

import { Model } from "@/lib/api";
import { createContext, useContext, ReactNode } from "react";

const ModelsContext = createContext<Model[]>([]);

interface ModelsProviderProps {
  models: Model[];
  children: ReactNode;
}

export function ModelsProvider({ models, children }: ModelsProviderProps) {
  return (
    <ModelsContext.Provider value={models}>{children}</ModelsContext.Provider>
  );
}

export function useModels() {
  const context = useContext(ModelsContext);
  if (context === undefined) {
    throw new Error("useModels must be used within a ModelsProvider");
  }
  return context;
}
