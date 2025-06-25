import React from "react";
import { getLast12Months } from "../hooks/useMonths";
import type { Purchase } from "../types";
import { useSelectedMonth } from "../context/SelectedMonthContext";

interface ExpensesViewProps {
  purchases: Purchase[];
}

function isInSelectedMonth(dateStr: string, selectedMonth: string) {
  const date = new Date(dateStr);
  const formatter = new Intl.DateTimeFormat("ru-RU", { month: "long", year: "numeric" });
  return formatter.format(date) === selectedMonth;
}

function formatDateTime(dateStr: string): string {
  const date = new Date(dateStr);
  const day = date.toLocaleDateString("ru-RU");
  const time = date.toLocaleTimeString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${day}, ${time}`;
}

function ExpensesView({ purchases }: ExpensesViewProps) {
  const { selectedMonth, setSelectedMonth, months } = useSelectedMonth();

  const filteredPurchases = purchases.filter((p) =>
    isInSelectedMonth(p.date, selectedMonth)
  );

  const total = filteredPurchases.reduce((sum, p) => sum + p.amount, 0);

  return (
    <div
      style={{
        height: "100vh",
        overflow: "hidden",
        position: "relative",
        width: "100%", // Убедимся, что контейнер растягивается
        boxSizing: "border-box", // Применяем глобально
      }}
    >
      {/* Зафиксированная верхняя панель */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          background: "white",
          padding: 12,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
          boxSizing: "border-box",
          width: "100%", // Убедимся, что панель растягивается
        }}
      >
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          style={{ fontSize: 16, padding: "6px 8px", width: 180 }}
        >
          {months.map((month, idx) => (
            <option key={idx} value={month}>
              {month}
            </option>
          ))}
        </select>
        <div style={{ fontWeight: "bold", fontSize: 16 }}>
          Итог: {total.toFixed(0)} RSD
        </div>
      </div>

      {/* Прокручиваемая часть — список покупок */}
      <div
        style={{
          marginTop: 72,
          height: "calc(100vh - 72px)", // Учитываем высоту верхней панели
          overflowY: "auto",
          width: "100%", // Растягиваем на всю ширину
          boxSizing: "border-box",
        }}
      >
        {filteredPurchases.length === 0 && (
          <p style={{ marginTop: 16, padding: "0 16px", width: "100%" }}>
            Покупок за этот месяц нет
          </p>
        )}

        <ul
          style={{
            listStyle: "none",
            padding: 0,
            margin: 0,
            width: "100%", // Убедимся, что список растягивается
            boxSizing: "border-box",
          }}
        >
          {filteredPurchases.map((purchase) => (
            <li
              key={purchase.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "12px 16px",
                borderBottom: "1px solid #ccc",
                alignItems: "center",
                fontSize: 14,
                width: "100%", // Растягиваем элемент списка
                boxSizing: "border-box",
              }}
            >
              <div style={{ flex: 1, minWidth: 0, overflow: "hidden" }}>
                <div style={{ fontWeight: "bold", color: "black" }}>{purchase.category}</div>
                <div style={{ textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                  {purchase.name}
                </div>
              </div>

              <div
                style={{
                  textAlign: "right",
                  minWidth: 120,
                  marginLeft: 16,
                  whiteSpace: "nowrap",
                }}
              >
                <div style={{ fontWeight: "bold" }}>{purchase.amount.toFixed(0)} RSD</div>
                <div style={{ fontSize: 12, color: "#666" }}>
                  {formatDateTime(purchase.date)}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ExpensesView;