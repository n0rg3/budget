// src/pages/Categories.tsx
import React, { useState, useContext, useMemo } from "react";
import { SelectedMonthContext } from "../context/SelectedMonthContext.tsx";
import { format, isSameMonth } from "date-fns";
import AddCategoryModal from "./AddCategoryModal.tsx";

interface Expense {
  id: string;
  amount: number;
  date: Date;
  description: string;
  categoryId: string;
}

interface Category {
  id: string;
  name: string;
  icon: string;
  expenses: Expense[];
}

interface Props {
  categories: Category[];
  addExpense: (expense: Omit<Expense, "id">) => void;
  addCategory: (category: Omit<Category, "id" | "expenses">) => void;
  deleteCategory: (id: string) => void;
  editCategory: (id: string, updates: Partial<Category>) => void;
}

const monthFormatter = new Intl.DateTimeFormat("ru-RU", { month: "long", year: "numeric" });

const past12Months = (() => {
  const result = [];
  const now = new Date();
  for (let i = 0; i < 12; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    result.push(d);
  }
  return result.reverse();
})();

const Categories: React.FC<Props> = ({
  categories,
  addExpense,
  addCategory,
  deleteCategory,
  editCategory,
}) => {
  const { selectedMonth, setSelectedMonth } = useContext(SelectedMonthContext);

  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [expenseDescription, setExpenseDescription] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);

  // Фильтруем расходы по выбранному месяцу
  const filteredCategories = useMemo(() => {
    return categories.map((cat) => ({
      ...cat,
      expenses: cat.expenses.filter((exp) => isSameMonth(exp.date, selectedMonth)),
    }));
  }, [categories, selectedMonth]);

  // Итог за месяц
  const totalExpenses = filteredCategories.reduce(
    (sum, cat) => sum + cat.expenses.reduce((s, e) => s + e.amount, 0),
    0
  );

  // Сумма по категории
  const getCategoryTotal = (cat: Category) =>
    cat.expenses.reduce((sum, e) => sum + e.amount, 0);

  // Валидация формы
  const isFormValid =
    selectedCategoryId !== null &&
    expenseAmount.trim() !== "" &&
    !isNaN(Number(expenseAmount)) &&
    Number(expenseAmount) > 0;

  const onAddExpense = () => {
    if (!isFormValid || !selectedCategoryId) return;
    addExpense({
      categoryId: selectedCategoryId,
      amount: Number(expenseAmount),
      date: new Date(),
      description: expenseDescription.trim(),
    });
    setExpenseAmount("");
    setExpenseDescription("");
    setSelectedCategoryId(null);
  };

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: 16 }}>
      {/* Header with month selector and total */}
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <select
          value={selectedMonth.toISOString()}
          onChange={(e) => setSelectedMonth(new Date(e.target.value))}
          style={{ fontSize: 16 }}
        >
          {past12Months.map((month) => (
            <option key={month.toISOString()} value={month.toISOString()}>
              {monthFormatter.format(month)}
            </option>
          ))}
        </select>

        <div style={{ fontWeight: "bold", fontSize: 18 }}>
          Итого: {totalExpenses.toFixed(0)} RSD
        </div>
      </header>

      {/* Categories grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(90px, 1fr))",
          gap: 12,
          marginTop: 20,
        }}
      >
        {filteredCategories.map((cat) => {
          const total = getCategoryTotal(cat);
          const isSelected = selectedCategoryId === cat.id;
          return (
            <div
              key={cat.id}
              onClick={() => setSelectedCategoryId(cat.id)}
              style={{
                cursor: "pointer",
                padding: 12,
                borderRadius: 8,
                backgroundColor: isSelected ? "#d0e3ff" : "#f0f0f0",
                textAlign: "center",
                userSelect: "none",
              }}
            >
              <div
                style={{
                  fontSize: 28,
                  marginBottom: 8,
                }}
                aria-label={cat.name}
              >
                {/* Можно заменить на иконки */}
                <span role="img" aria-label={cat.name}>
                  {cat.icon}
                </span>
              </div>
              <div
                style={{
                  fontWeight: "bold",
                  fontSize: 14,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
                title={cat.name}
              >
                {cat.name}
              </div>
              <div style={{ fontSize: 12, marginTop: 4 }}>{total.toFixed(0)} RSD</div>
              {/* TODO: Добавить контекстное меню для редактирования/удаления */}
            </div>
          );
        })}

        {/* Button to open add category modal */}
        <button
          onClick={() => setIsAddCategoryOpen(true)}
          style={{
            padding: 12,
            borderRadius: 8,
            border: "2px dashed #aaa",
            background: "transparent",
            fontWeight: "bold",
            fontSize: 14,
            cursor: "pointer",
          }}
          aria-label="Добавить категорию"
        >
          + Добавить
        </button>
      </div>

      {/* Add expense form */}
      <div
        style={{
          marginTop: 30,
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        <input
          type="text"
          placeholder="Описание траты"
          value={expenseDescription}
          onChange={(e) => setExpenseDescription(e.target.value)}
          style={{ padding: 8, fontSize: 16, borderRadius: 6, border: "1px solid #ccc" }}
        />
        <input
          type="number"
          placeholder="Сумма"
          value={expenseAmount}
          onChange={(e) => setExpenseAmount(e.target.value)}
          style={{ padding: 8, fontSize: 16, borderRadius: 6, border: "1px solid #ccc" }}
          min={0}
        />
        <button
          disabled={!isFormValid}
          onClick={onAddExpense}
          style={{
            padding: 12,
            backgroundColor: isFormValid ? "#007bff" : "#999",
            color: "white",
            borderRadius: 6,
            fontWeight: "bold",
            cursor: isFormValid ? "pointer" : "not-allowed",
            border: "none",
          }}
        >
          Добавить трату
        </button>
      </div>

      {/* Add Category Modal */}
      {isAddCategoryOpen && (
        <AddCategoryModal
          onClose={() => setIsAddCategoryOpen(false)}
          onAdd={(name: string, icon: string) => {
            addCategory({ name, icon });
            setIsAddCategoryOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default Categories;
