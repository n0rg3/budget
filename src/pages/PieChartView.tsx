// src/pages/PieChartView.tsx
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Label,
} from "recharts";
import { useSelectedMonth } from "../context/SelectedMonthContext";
import type { Purchase } from "../types";

// Генерация цвета по индексу
function generateColor(index: number): string {
  const hue = (index * 137.508) % 360;
  return `hsl(${hue}, 70%, 60%)`;
}

interface PieChartViewProps {
  purchases: Purchase[];
}

function isInSelectedMonth(dateStr: string, selectedMonth: string) {
  const date = new Date(dateStr);
  const formatter = new Intl.DateTimeFormat("ru-RU", {
    month: "long",
    year: "numeric",
  });
  return formatter.format(date) === selectedMonth;
}

function PieChartView({ purchases }: PieChartViewProps) {
  const { selectedMonth, setSelectedMonth, months } = useSelectedMonth();

  const filtered = purchases.filter((p) =>
    isInSelectedMonth(p.date, selectedMonth)
  );

  const total = filtered.reduce((sum, p) => sum + p.amount, 0);

  const categoryMap: Record<string, number> = {};
  filtered.forEach((p) => {
    categoryMap[p.category] = (categoryMap[p.category] || 0) + p.amount;
  });

  const data = Object.entries(categoryMap)
    .map(([name, value], index) => ({
      name,
      value,
      percent: ((value / total) * 100).toFixed(1),
      color: generateColor(index),
    }))
    .sort((a, b) => b.value - a.value); // ⬅️ Сортировка по убыванию суммы

  return (
    <div style={{ height: "100vh", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      {/* Верхняя панель */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          background: "white",
          zIndex: 1000,
          padding: "12px 16px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
        }}
      >
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          style={{ fontSize: 16, padding: "6px 8px", width: 150 }}
        >
          {months.map((month, idx) => (
            <option key={idx} value={month}>{month}</option>
          ))}
        </select>
        <div style={{ fontSize: 16, fontWeight: "bold" }}>
          Итог: {total.toFixed(0)} RSD
        </div>
      </div>

      {/* Содержимое под панелью */}
      <div style={{ marginTop: 72, flexGrow: 1, overflowY: "auto", padding: "0 16px", paddingBottom: 80 }}>
        {data.length === 0 ? (
          <p style={{ marginTop: 20 }}>Нет данных для отображения</p>
        ) : (
          <>
            <ResponsiveContainer width="100%" height={270}>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="55%"
                  innerRadius={60}
                  outerRadius={100}
                  dataKey="value"
                  paddingAngle={2}
                  label={({ percent }) => {
                  if (percent === undefined || percent === null) return "";
                  return `${(percent * 1).toFixed(0)}%`;
                }}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                  <Label
                    value="Расходы"
                    position="center"
                    fill="#333"
                    style={{ fontSize: 16 }}
                  />
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            {/* Легенда */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 6,
                justifyContent: "center",
                marginTop: 20,
              }}
            >
              {data.map((entry, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    width: 80,
                  }}
                >
                  <div style={{ fontSize: 14, fontWeight: 500, textAlign: "center", marginBottom: 8 }}>
                    {entry.name}
                  </div>
                  <div
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: "50%",
                      backgroundColor: entry.color,
                      marginBottom: 6,
                    }}
                  />
                  <div style={{ fontSize: 12, color: "black" }}>{entry.percent}%</div>
                  <div style={{ fontSize: 12, color: "#777" }}>{entry.value.toFixed(0)} RSD</div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default PieChartView;
