import React, { useState } from "react";

interface Category {
  name: string;
  icon: string;
}

export default function CategoriesView() {
  const [categories, setCategories] = useState<Category[]>([
    { name: "Продукты", icon: "🛒" },
    { name: "Транспорт", icon: "🚗" },
  ]);
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState<number | null>(null);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryIcon, setNewCategoryIcon] = useState("💡");

  const addCategory = () => {
    if (newCategoryName.trim()) {
      setCategories([...categories, { name: newCategoryName, icon: newCategoryIcon }]);
      setNewCategoryName("");
      setNewCategoryIcon("💡");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Категории</h2>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 20 }}>
        {categories.map((category, index) => (
          <div
            key={index}
            style={{
              border: selectedCategoryIndex === index ? "2px solid blue" : "1px solid gray",
              borderRadius: 8,
              padding: 10,
              textAlign: "center",
              width: 100,
              cursor: "pointer",
              backgroundColor: selectedCategoryIndex === index ? "#e0f0ff" : "#f9f9f9",
            }}
            onClick={() => setSelectedCategoryIndex(index)}
          >
            <div style={{ fontSize: 24 }}>{category.icon}</div>
            <div style={{ marginTop: 4 }}>{category.name}</div>
          </div>
        ))}
      </div>

      <h3>Добавить категорию</h3>
      <input
        type="text"
        placeholder="Название"
        value={newCategoryName}
        onChange={(e) => setNewCategoryName(e.target.value)}
        style={{ marginRight: 8 }}
      />
      <input
        type="text"
        placeholder="Иконка (эмодзи)"
        value={newCategoryIcon}
        onChange={(e) => setNewCategoryIcon(e.target.value)}
        style={{ marginRight: 8, width: 50, textAlign: "center" }}
      />
      <button onClick={addCategory}>Добавить</button>
    </div>
  );
}
