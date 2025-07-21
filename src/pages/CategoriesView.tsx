import React, { useState } from "react";
import AddCategoryModal from "../components/AddCategoryModal";
import EditCategoryModal from "../components/EditCategoryModal";
import { useSelectedMonth } from "../context/SelectedMonthContext";
import type { Category, Purchase } from "../types";
import { evaluate } from "mathjs";
import { iconMap } from "../constants/iconOptions";
import { PlusIcon } from "lucide-react";

function isValidExpression(expr: string): boolean {
  try {
    const result = evaluate(expr);
    return typeof result === "number" && !isNaN(result) && result > 0;
  } catch {
    return false;
  }
}

function isInSelectedMonth(dateStr: string, selectedMonth: string) {
  const date = new Date(dateStr);
  const formatter = new Intl.DateTimeFormat("ru-RU", {
    month: "long",
    year: "numeric",
  });
  return formatter.format(date) === selectedMonth;
}

interface CategoriesViewProps {
  categories: Category[];
  purchases: Purchase[];
  addCategory: (name: string, icon: string) => void;
  addPurchase: (purchase: Omit<Purchase, "id" | "date">) => void;
}

function CategoriesView({
  categories: initialCategories,
  purchases,
  addCategory,
  addPurchase,
}: CategoriesViewProps) {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState<number | null>(null);
  const [purchaseName, setPurchaseName] = useState("");
  const [purchaseAmount, setPurchaseAmount] = useState("");
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const { selectedMonth, setSelectedMonth, months } = useSelectedMonth();

  const totalSum = purchases
    .filter((p) => isInSelectedMonth(p.date, selectedMonth))
    .reduce((sum, p) => sum + p.amount, 0);

  const isButtonDisabled =
    !purchaseAmount || selectedCategoryIndex === null || !isValidExpression(purchaseAmount);

  const handleAddPurchase = () => {
    if (isButtonDisabled) return;

    let amount: number;
    try {
      amount = evaluate(purchaseAmount);
    } catch {
      return;
    }

    addPurchase({
      name: purchaseName || "",
      amount,
      category: categories[selectedCategoryIndex].name,
    });

    setPurchaseName("");
    setPurchaseAmount("");
    setSelectedCategoryIndex(null);
  };

  const handleLongPress = (cat: Category) => {
    setEditingCategory(cat);
    setShowEditModal(true);
  };

  const handleUpdateCategory = (updated: Category) => {
    setCategories((prev) =>
      prev.map((cat) => (cat.name === editingCategory?.name ? updated : cat))
    );
    setEditingCategory(null);
    setShowEditModal(false);
  };

  const handleDeleteCategory = (categoryToDelete: Category) => {
    setCategories((prev) =>
      prev.filter((cat) => cat.name !== categoryToDelete.name)
    );
    setEditingCategory(null);
    setShowEditModal(false);
  };

  return (
    <div
      style={{
        height: "100vh",
        position: "relative",
        overflow: "hidden",
        paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 80px)",
      }}
    >
      {/* Верхняя панель */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          background: "white",
          padding: "12px 16px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
          boxSizing: "border-box",
          width: "100vw", // Полная ширина окна
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
        <div style={{ fontSize: 16, fontWeight: "bold" }}>
          Итог: {totalSum.toFixed(0)} RSD
        </div>
      </div>

      {/* Категории */}
      <div
        style={{
          marginTop: 72,
          marginBottom: 180,
          padding: "0 16px",
          height: "calc(450vh - 252px)",
          overflowY: "auto",
          display: "flex",
          flexWrap: "wrap",
          gap: 12,
          alignContent: "flex-start",
          WebkitUserSelect: "none",
          userSelect: "none",
        }}
      >
        {categories.map((cat, i) => {
          const Icon = iconMap[cat.icon];
          const isSelected = i === selectedCategoryIndex;

          const sumByCategory = purchases
            .filter((p) => p.category === cat.name)
            .filter((p) => isInSelectedMonth(p.date, selectedMonth))
            .reduce((sum, p) => sum + p.amount, 0);

          return (
            <div
              key={i}
              onClick={() => setSelectedCategoryIndex(i)}
              onTouchStart={(e) => {
                const timeout = setTimeout(() => handleLongPress(cat), 500);
                e.currentTarget.ontouchend = () => clearTimeout(timeout);
              }}
              onContextMenu={(e) => {
                e.preventDefault();
                handleLongPress(cat);
              }}
              style={{
                cursor: "pointer",
                textAlign: "center",
                borderRadius: 12,
                padding: 10,
                border: isSelected ? "1px solid blue" : "1px solid #ccc",
                background: isSelected ? "#e0f0ff" : "#f9f9f9",
                width: 80,
                height: 80,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                userSelect: "none",
              }}
            >
              <div style={{ fontSize: 14, fontWeight: "bold" }}>{cat.name}</div>
              {Icon && <Icon size={28} />}
              <div style={{ fontSize: 14, marginTop: 6 }}>{sumByCategory} RSD</div>
            </div>
          );
        })}

        {/* Добавить категорию */}
        <div
          onClick={() => setShowAddModal(true)}
          style={{
            cursor: "pointer",
            textAlign: "center",
            borderRadius: 12,
            padding: 10,
            border: "1px solid #ccc",
            background: "#f9f9f9",
            width: 80,
            height: 80,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            color: "#666",
            userSelect: "none",
          }}
        >
          <PlusIcon size={28} />
          <div style={{ fontSize: 14, marginTop: 4 }}>Добавить</div>
        </div>
      </div>

      {/* Нижняя панель */}
      <div
        style={{
          position: "fixed",
          bottom: 60,
          left: 0,
          right: 0,
          backgroundColor: "white",
          padding: "10px 20px",
          paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 10px)",
          boxShadow: "0 -2px 5px rgba(0,0,0,0.1)",
          display: "flex",
          flexDirection: "column",
          gap: 8,
          zIndex: 1000,
          alignItems: "center",
        }}
      >
        <input
          type="text"
          placeholder="Название покупки"
          value={purchaseName}
          onChange={(e) => setPurchaseName(e.target.value)}
          style={{
            width: "300px",
            padding: 8,
            fontSize: 16,
            border: "1px solid #666",
            borderRadius: 6,
          }}
        />
        <input
          type="text"
          placeholder="Сумма"
          value={purchaseAmount}
          onChange={(e) => setPurchaseAmount(e.target.value)}
          style={{
            width: "300px",
            padding: 8,
            fontSize: 16,
            border: "1px solid #666",
            borderRadius: 6,
          }}
        />
        <button
          onClick={handleAddPurchase}
          disabled={isButtonDisabled}
          style={{
            width: "150px",
            padding: "10px 16px",
            background: "#007bff",
            color: "white",
            fontSize: 16,
            border: "none",
            borderRadius: 12,
            cursor: isButtonDisabled ? "default" : "pointer",
            opacity: isButtonDisabled ? 0.5 : 1,
          }}
        >
          Добавить
        </button>
      </div>

      {/* Модалки */}
      {showAddModal && (
        <AddCategoryModal
          onClose={() => setShowAddModal(false)}
          onAdd={(name, icon) => {
            setCategories((prev) => [...prev, { name, icon }]);
            addCategory(name, icon);
            setShowAddModal(false);
          }}
        />
      )}

      {showEditModal && editingCategory && (
        <EditCategoryModal
          category={editingCategory}
          purchases={purchases}
          onClose={() => {
            setShowEditModal(false);
            setEditingCategory(null);
          }}
          onSave={handleUpdateCategory}
          onDelete={() => handleDeleteCategory(editingCategory)}
        />
      )}
    </div>
  );
}

export default CategoriesView;
