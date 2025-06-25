// src/App.tsx
import { BrowserRouter as Router, Routes, Route, NavLink, Navigate } from "react-router-dom";
import CategoriesView from "./pages/CategoriesView";
import PieChartView from "./pages/PieChartView";
import ExpensesView from "./pages/ExpensesView";
import { useState } from "react";
import { FaListUl, FaChartPie, FaTags } from "react-icons/fa";
import type { Category, Purchase } from "./types";
import { SelectedMonthProvider } from "./context/SelectedMonthContext";
import { HashRouter } from "react-router-dom";

<HashRouter>
  <App />
</HashRouter>


import "./App.css";

export default function App() {
const [categories, setCategories] = useState<Category[]>([
  { name: "Продукты", icon: "FaShoppingCart" },
  { name: "Транспорт", icon: "FaBus" },
]);

const [purchases, setPurchases] = useState<Purchase[]>([]);

const addCategory = (name: string, icon: string) => {
  setCategories((prev) => [...prev, { name, icon }]);
};

const addPurchase = (purchase: Omit<Purchase, "id" | "date">) => {
  setPurchases((prev) => [
    ...prev,
    { ...purchase, id: Date.now(), date: new Date().toISOString() },
  ]);
};


  return (
  
  <SelectedMonthProvider>
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Navigate to="/categories" replace />} />
          <Route
            path="/categories"
            element={
              <CategoriesView
                purchases={purchases}
                categories={categories}
                addCategory={addCategory}
                addPurchase={addPurchase}
              />
            }
          />
          <Route path="/chart" element={<PieChartView purchases={purchases} />} />
          <Route path="/expenses" element={<ExpensesView purchases={purchases} />} />
        </Routes>

        <nav className="bottom-nav">
          <NavLink to="/categories" className={({ isActive }) => (isActive ? "active" : "")}>
            <FaTags />
            <span>Категории</span>
          </NavLink>
          <NavLink to="/chart" className={({ isActive }) => (isActive ? "active" : "")}>
            <FaChartPie />
            <span>Диаграмма</span>
          </NavLink>
          <NavLink to="/expenses" className={({ isActive }) => (isActive ? "active" : "")}>
            <FaListUl />
            <span>Покупки</span>
          </NavLink>
        </nav>
      </div>
    </Router>
  </SelectedMonthProvider>
  );
}
