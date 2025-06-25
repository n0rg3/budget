import React, { useState } from "react";
import { getLast12Months } from "../hooks/useMonths"; // если у тебя есть такой хук
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

function ExpensesView({ purchases }: ExpensesViewProps) {
  const { selectedMonth, setSelectedMonth, months } = useSelectedMonth();

  // Фильтрация покупок по выбранному месяцу
  const filteredPurchases = purchases.filter((p) =>
    isInSelectedMonth(p.date, selectedMonth)
  );

  // Итог сумма по фильтрованным покупкам
  const total = filteredPurchases.reduce((sum, p) => sum + p.amount, 0);

  return (
    <div>
      <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", padding: 12}}>
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

      {filteredPurchases.length === 0 && <p>Покупок за этот месяц нет</p>}

      <ul style={{ listStyle: "none", padding: 0 }}>
        {filteredPurchases.map((purchase) => (
          <li
            key={purchase.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: 10,
              borderBottom: "1px solid #ccc",
              alignItems: "center",
              fontSize: 14,
            }}
          >
            <div>
              <div style={{ fontWeight: "bold", color: "black" }}>{purchase.category}</div>
              <div>{purchase.name}</div>
            </div>

            <div style={{ textAlign: "right" }}>
              <div style={{ fontWeight: "bold" }}>{purchase.amount.toFixed(0)} RSD</div>
              <div style={{ fontSize: 12, color: "#666" }}>
                {new Date(purchase.date).toLocaleDateString("ru-RU")}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ExpensesView;
