import React from "react";
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
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        width: "100%",
        background: "#fff",
        overflow: "hidden", // убираем общий скролл
      }}
    >
      {/* Верхняя панель */}
      <div
        style={{
          flexShrink: 0,
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: 80,
          background: "white",
          padding: "12px 16px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
          zIndex: 100,
        }}
      >
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          style={{ fontSize: 16, padding: "6px 8px", width: 150 }}
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

      {/* Прокручиваемый список покупок */}
      <div
        style={{
          flex: 1,
          marginTop: 110,
          marginBottom: 0,
          overflowY: "auto",
          WebkitOverflowScrolling: "touch",
          padding: "0 16px",
        }}
      >
        {filteredPurchases.length === 0 && (
          <p style={{ marginTop: 16, textAlign: "center" }}>
            Покупок за этот месяц нет
          </p>
        )}

        <ul
          style={{
            listStyle: "none",
            padding: 0,
            margin: 0,
            width: "100%",
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
                borderBottom: "1px solid #eee",
                alignItems: "center",
                fontSize: 14,
              }}
            >
              {/* Левая часть */}
              <div style={{ flex: 1, minWidth: 0, overflow: "hidden" }}>
                <div style={{ fontWeight: 600 }}>{purchase.category}</div>
                <div
                  style={{
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    color: "#333",
                  }}
                >
                  {purchase.name}
                </div>
              </div>

              {/* Правая часть */}
              <div
                style={{
                  textAlign: "right",
                  minWidth: 120,
                  marginLeft: 16,
                  whiteSpace: "nowrap",
                }}
              >
                <div style={{ fontWeight: 600 }}>{purchase.amount.toFixed(0)} RSD</div>
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
