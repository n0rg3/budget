import React, { useState } from "react";
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

// SVG стрелка вниз (иконка)
const ArrowIcon = ({ rotated }: { rotated: boolean }) => (
  <svg
    style={{
      width: 16,
      height: 16,
      transition: "transform 0.3s ease",
      transform: rotated ? "rotate(180deg)" : "rotate(0deg)",
    }}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

function ExpensesView({ purchases }: ExpensesViewProps) {
  const { selectedMonth, setSelectedMonth, months } = useSelectedMonth();

  const filteredPurchases = purchases.filter((p) =>
    isInSelectedMonth(p.date, selectedMonth)
  );

  const total = filteredPurchases.reduce((sum, p) => sum + p.amount, 0);

  const purchasesByCategory: Record<string, Purchase[]> = {};
  filteredPurchases.forEach((p) => {
    if (!purchasesByCategory[p.category]) purchasesByCategory[p.category] = [];
    purchasesByCategory[p.category].push(p);
  });

  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [allExpanded, setAllExpanded] = useState(false);

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

const toggleAll = () => {
  setAllExpanded((prev) => !prev);
};


  // Стили для анимации раскрытия
  const collapsibleStyle = (expanded: boolean) => ({
    maxHeight: expanded ? 1000 : 0, // достаточно большой maxHeight
    overflow: "hidden",
    transition: "max-height 0.4s ease",
  });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        width: "100%",
        background: "#fff",
        overflow: "hidden",
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

      {/* Список */}
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

        {/* "Все покупки" */}
        <div
          onClick={toggleAll}
          style={{
            cursor: "pointer",
            padding: "12px 16px",
            borderBottom: "1px solid #ddd",
            fontWeight: "700",
            fontSize: 16,
            userSelect: "none",
            backgroundColor: "#f0f0f0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
          aria-expanded={allExpanded}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") toggleAll();
          }}
        >
          <span>Все покупки</span>
          <ArrowIcon rotated={allExpanded} />
        </div>
        <div style={collapsibleStyle(allExpanded)}>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {filteredPurchases.map((purchase) => (
              <li
                key={purchase.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "8px 16px",
                  borderBottom: "1px solid #eee",
                  alignItems: "center",
                  fontSize: 14,
                }}
              >
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

        {/* Категории */}
        {Object.entries(purchasesByCategory).map(([category, purchases]) => (
          <div key={category} style={{ marginTop: 8 }}>
            <div
              onClick={() => toggleCategory(category)}
              style={{
                cursor: "pointer",
                padding: "12px 16px",
                borderBottom: "1px solid #ddd",
                fontWeight: "600",
                fontSize: 14,
                userSelect: "none",
                backgroundColor: "#fafafa",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
              aria-expanded={expandedCategories[category] || false}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") toggleCategory(category);
              }}
            >
              <span>{category}</span>
              <ArrowIcon rotated={!!expandedCategories[category]} />
            </div>
            <div style={collapsibleStyle(!!expandedCategories[category])}>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {purchases.map((purchase) => (
                  <li
                    key={purchase.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "8px 16px",
                      borderBottom: "1px solid #eee",
                      alignItems: "center",
                      fontSize: 14,
                    }}
                  >
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
        ))}
      </div>
    </div>
  );
}

export default ExpensesView;
