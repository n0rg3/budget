// src/context/SelectedMonthContext.tsx
import React, { createContext, useState, useContext } from "react";

// Тип для значения контекста
type SelectedMonthContextType = {
  selectedMonth: Date;
  setSelectedMonth: (date: Date) => void;
};

// Создание контекста
const SelectedMonthContext = createContext<SelectedMonthContextType | undefined>(undefined);

// Провайдер
export const SelectedMonthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  return (
    <SelectedMonthContext.Provider value={{ selectedMonth, setSelectedMonth }}>
      {children}
    </SelectedMonthContext.Provider>
  );
};

// Хук для использования контекста
export const useSelectedMonth = (): SelectedMonthContextType => {
  const context = useContext(SelectedMonthContext);
  if (!context) {
    throw new Error("useSelectedMonth must be used within a SelectedMonthProvider");
  }
  return context;
};
