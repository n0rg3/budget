// src/context/SelectedMonthContext.tsx
import  React, { createContext, useState, useContext, ReactNode } from "react";
import { getLast12Months } from "../hooks/useMonths";

interface SelectedMonthContextType {
  selectedMonth: string;
  setSelectedMonth: (month: string) => void;
  months: string[];
}

const SelectedMonthContext = createContext<SelectedMonthContextType | undefined>(undefined);

export function SelectedMonthProvider({ children }: { children: ReactNode }) {
  const months = getLast12Months();
  const [selectedMonth, setSelectedMonth] = useState(months[0]);

  return (
    <SelectedMonthContext.Provider value={{ selectedMonth, setSelectedMonth, months }}>
      {children}
    </SelectedMonthContext.Provider>
  );
}

export function useSelectedMonth() {
  const context = useContext(SelectedMonthContext);
  if (!context) {
    throw new Error("useSelectedMonth must be used within SelectedMonthProvider");
  }
  return context;
}
