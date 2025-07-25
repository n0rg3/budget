import React, { useState, useEffect } from "react";
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
  const [keyboardOffset, setKeyboardOffset] = useState(0);

  useEffect(() => {
  const viewport = window.visualViewport;
  if (!viewport) return;

  const handleResize = () => {
    const keyboardHeight = window.innerHeight - viewport.height - viewport.offsetTop;
    setKeyboardOffset(keyboardHeight);
  };

  viewport.addEventListener("resize", handleResize);
  return () => viewport.removeEventListener("resize", handleResize);
}, []);



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
        <div style={{ fontSize: 16, fontWeight: "bold" }}>
          Итог: {totalSum.toFixed(0)} RSD
        </div>
      </div>

{/* Контейнер категорий */}
<div
  style={{
    flex: 1,
    paddingTop: "110px",
    paddingBottom: selectedCategoryIndex !== null ? "180px" : "20px", // адаптивный отступ
    overflowY: "auto",
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 16,
    justifyItems: "center",
    alignContent: "start",
    WebkitOverflowScrolling: "touch",
  }}
  onClick={() => setSelectedCategoryIndex(null)} // сброс по клику
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
        onClick={(e) => {
          e.stopPropagation(); // чтобы клик на категории не сбрасывал выбор
          setSelectedCategoryIndex(i);
        }}
        onTouchStart={(e) => {
          const timeout = setTimeout(() => handleLongPress(cat), 500);
          e.currentTarget.ontouchend = () => clearTimeout(timeout);
        }}
        onContextMenu={(e) => {
          e.preventDefault();
          handleLongPress(cat);
        }}
        style={{
          textAlign: "center",
          cursor: "pointer",
          userSelect: "none",
        }}
      >
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
          {cat.name}
        </div>
        <div
          style={{
            width: 60,
            height: 60,
            borderRadius: "50%",
            background: isSelected ? "#e0f0ff" : "#f9f9f9",
            border: isSelected ? "1px solid #007bff" : "1px solid #ccc",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 6px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            transition: "all 0.2s ease",
            transform: isSelected ? "scale(1.05)" : "scale(1)",
          }}
        >
          {Icon && <Icon size={28} />}
        </div>
        <div style={{ fontSize: 13, color: "#333" }}>
          {sumByCategory} RSD
        </div>
      </div>
    );
  })}

  {/* Кнопка добавления категории */}
  <div
    onClick={(e) => {
      e.stopPropagation();
      setShowAddModal(true);
    }}
    style={{
      textAlign: "center",
      cursor: "pointer",
      userSelect: "none",
    }}
  >
    <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
      Добавить
    </div>
    <div
      style={{
        width: 60,
        height: 60,
        borderRadius: "50%",
        background: "#f9f9f9",
        border: "1px solid #ccc",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: "0 auto 6px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
      }}
    >
      <PlusIcon size={28} />
    </div>
  </div>
</div>


      {/* Нижняя панель */}
{selectedCategoryIndex !== null && (
  <div
    style={{
      position: "fixed",
      bottom: 60,
      left: 0,
      right: 0,
      backgroundColor: "white",
      padding: "10px 20px calc(env(safe-area-inset-bottom) + 10px)",
      boxShadow: "0 -2px 5px rgba(0,0,0,0.1)",
      display: "flex",
      flexDirection: "column",
      gap: 8,
      zIndex: 100,
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
)}


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
