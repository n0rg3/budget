import React from "react";
import type { Purchase } from "../types";

interface ExpensesViewProps {
  purchases: Purchase[];
}

function ExpensesView({ purchases }: ExpensesViewProps) {
  return (
    <div>
      <h1>Список покупок</h1>

      {purchases.length === 0 && <p>Пока нет покупок</p>}

      <ul style={{ padding: 0, listStyle: "none" }}>
        {purchases.map((purchase) => (
          <li
            key={purchase.id}
            style={{
              padding: 10,
              borderBottom: "1px solid #ccc",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <div>
              <b>{purchase.name}</b> — <i>{purchase.category}</i>
            </div>
            <div>{purchase.amount.toFixed(0)} RSD</div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ExpensesView;
