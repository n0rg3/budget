// src/App.tsx
import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import CategoriesView from "./pages/CategoryView";
import PieChartView from "./pages/PieChartView";
import ExpensesListView from "./pages/ExpensesListView";

import "./App.css"; // создадим стили для табов

export default function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<CategoriesView />} />
          <Route path="/chart" element={<PieChartView />} />
          <Route path="/expenses" element={<ExpensesListView />} />
        </Routes>

        <nav className="bottom-nav">
          <NavLink to="/" end>
            Категории
          </NavLink>
          <NavLink to="/chart">
            Диаграмма
          </NavLink>
          <NavLink to="/expenses">
            Покупки
          </NavLink>
        </nav>
      </div>
    </Router>
  );
}
