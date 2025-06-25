import React, { useState } from "react";
import * as FaIcons from "react-icons/fa";
import AddCategoryModal from "../components/AddCategoryModal";
import { getLast12Months } from "../hooks/useMonths";
import { useSelectedMonth } from "../context/SelectedMonthContext";


import type { Category, Purchase } from "../types";

interface CategoriesViewProps {
  categories: Category[];
  purchases: Purchase[];
  addCategory: (name: string, icon: string) => void;
  addPurchase: (purchase: Omit<Purchase, "id" | "date">) => void;
}

function isInSelectedMonth(dateStr: string, selectedMonth: string) {
  const date = new Date(dateStr);
  const formatter = new Intl.DateTimeFormat("ru-RU", { month: "long", year: "numeric" });
  return formatter.format(date) === selectedMonth;
}

function CategoriesView({ categories, purchases, addCategory, addPurchase }: CategoriesViewProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState<number | null>(null);
  const [purchaseName, setPurchaseName] = useState("");
  const [purchaseAmount, setPurchaseAmount] = useState("");

  const { selectedMonth, setSelectedMonth, months } = useSelectedMonth();

  const handleAddPurchase = () => {
    if (selectedCategoryIndex === null || !purchaseName || !purchaseAmount) return;

    const amount = parseFloat(purchaseAmount);
    if (isNaN(amount) || amount <= 0) return;

    addPurchase({
      name: purchaseName,
      amount,
      category: categories[selectedCategoryIndex].name,
    });

    setPurchaseName("");
    setPurchaseAmount("");
    setSelectedCategoryIndex(null);
  };

  // Итог по всем покупкам выбранного месяца
  const totalForMonth = purchases
    .filter((p) => isInSelectedMonth(p.date, selectedMonth))
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          padding: "10px 0",
        }}
      >
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          style={{
            fontSize: 16,
            padding: "6px 8px",
            width: 150,
          }}
        >
          {months.map((month, idx) => (
            <option key={idx} value={month}>
              {month}
            </option>
          ))}
        </select>

        <div style={{ fontSize: 16, fontWeight: "bold" }}>
          Итог:&nbsp;{totalForMonth.toFixed(0)} RSD
        </div>
      </div>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        {categories.map((cat, i) => {
          const Icon = FaIcons[cat.icon as keyof typeof FaIcons];
          const isSelected = i === selectedCategoryIndex;

          return (
            <div
              key={i}
              onClick={() => setSelectedCategoryIndex(i)}
              style={{
                cursor: "pointer",
                textAlign: "center",
                borderRadius: 12,
                padding: 10,
                border: isSelected ? "2px solid blue" : "1px solid #ccc",
                background: isSelected ? "#e0f0ff" : "#f9f9f9",
                minWidth: 70,
                userSelect: "none",
              }}
            >
              {Icon && <Icon size={24} />}
              <div style={{ fontSize: 14 }}>{cat.name}</div>
            </div>
          );
        })}

        <div
          onClick={() => setShowAddModal(true)}
          style={{
            cursor: "pointer",
            textAlign: "center",
            borderRadius: 12,
            padding: 10,
            border: "1px solid #ccc",
            background: "#f9f9f9",
            minWidth: 70,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            color: "#666",
            userSelect: "none",
          }}
        >
          <FaIcons.FaPlus size={24} />
          <div style={{ fontSize: 14, marginTop: 4 }}>Добавить</div>
        </div>
      </div>

      <div style={{ marginTop: 30 }}>
        <input
          type="text"
          placeholder="Название покупки"
          value={purchaseName}
          onChange={(e) => setPurchaseName(e.target.value)}
          style={{ width: "100%", marginBottom: 8, padding: 8, fontSize: 16 }}
        />
        <input
          type="number"
          placeholder="Сумма"
          value={purchaseAmount}
          onChange={(e) => setPurchaseAmount(e.target.value)}
          style={{ width: "100%", marginBottom: 8, padding: 8, fontSize: 16 }}
        />
        <button
          onClick={handleAddPurchase}
          disabled={!purchaseName || !purchaseAmount || selectedCategoryIndex === null}
          style={{
            width: "100%",
            padding: 10,
            background: "#007bff",
            color: "white",
            fontSize: 16,
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
            opacity: !purchaseName || !purchaseAmount || selectedCategoryIndex === null ? 0.5 : 1,
          }}
        >
          Добавить покупку
        </button>
      </div>

      {showAddModal && (
        <AddCategoryModal
          onClose={() => setShowAddModal(false)}
          onAdd={(name, icon) => {
            addCategory(name, icon);
            setShowAddModal(false);
          }}
        />
      )}
    </div>
  );
}

export default CategoriesView;
