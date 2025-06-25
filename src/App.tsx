// src/App.tsx
import { BrowserRouter as Router, Routes, Route, NavLink, Navigate } from "react-router-dom";
import CategoriesView from "./pages/CategoriesView";
import PieChartView from "./pages/PieChartView";
import ExpensesListView from "./pages/ExpensesListView";

import { FaListUl, FaChartPie, FaTags } from "react-icons/fa"; // иконки

import "./App.css";

export default function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Navigate to="/categories" replace />} />
          <Route path="/categories" element={<CategoriesView />} />
          <Route path="/chart" element={<PieChartView />} />
          <Route path="/expenses" element={<ExpensesListView />} />
        </Routes>

        <nav className="bottom-nav">
          <NavLink to="/categories">
            <FaTags />
            <span>Категории</span>
          </NavLink>
          <NavLink to="/chart">
            <FaChartPie />
            <span>Диаграмма</span>
          </NavLink>
          <NavLink to="/expenses">
            <FaListUl />
            <span>Покупки</span>
          </NavLink>
        </nav>
      </div>
    </Router>
  );
}
