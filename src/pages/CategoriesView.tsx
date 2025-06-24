import React, { useState } from "react";
import AddCategoryModal from "../components/AddCategoryModal"; // путь поправь под свой

interface Purchase {
  description: string;
  amount: number;
  categoryIndex: number; // индекс категории, чтобы связать с покупкой
}

function CategoriesView() {
  const [categories, setCategories] = useState<{ name: string; icon: string }[]>([
    { name: "Продукты", icon: "🛒" },
    { name: "Транспорт", icon: "🚗" },
  ]);

  const [purchases, setPurchases] = useState<Purchase[]>([]);

  const [showAddModal, setShowAddModal] = useState(false);

  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState<number | null>(null);

  const [purchaseDescription, setPurchaseDescription] = useState("");
  const [purchaseAmount, setPurchaseAmount] = useState("");

  const handleAddCategory = (name: string, icon: string) => {
    setCategories((prev) => [...prev, { name, icon }]);
    setShowAddModal(false);
  };

  const handleAddPurchase = () => {
    if (
      selectedCategoryIndex !== null &&
      purchaseDescription.trim() !== "" &&
      purchaseAmount.trim() !== "" &&
      !isNaN(Number(purchaseAmount))
    ) {
      setPurchases((prev) => [
        ...prev,
        {
          description: purchaseDescription.trim(),
          amount: Number(purchaseAmount),
          categoryIndex: selectedCategoryIndex,
        },
      ]);
      setPurchaseDescription("");
      setPurchaseAmount("");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Категории</h1>
      <button onClick={() => setShowAddModal(true)}>Добавить категорию</button>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {categories.map((cat, idx) => (
          <li
            key={idx}
            onClick={() => setSelectedCategoryIndex(idx)}
            style={{
              cursor: "pointer",
              padding: 8,
              backgroundColor: selectedCategoryIndex === idx ? "#cce5ff" : "transparent",
              borderRadius: 4,
              marginTop: 8,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span style={{ fontSize: "1.5rem" }}>{cat.icon}</span> {cat.name}
          </li>
        ))}
      </ul>

      {selectedCategoryIndex !== null && (
        <div style={{ marginTop: 20 }}>
          <h2>
            Добавить покупку в категорию: {categories[selectedCategoryIndex].name}
          </h2>
          <input
            type="text"
            placeholder="Описание"
            value={purchaseDescription}
            onChange={(e) => setPurchaseDescription(e.target.value)}
            style={{ padding: 8, width: "100%", marginBottom: 10 }}
          />
          <input
            type="number"
            placeholder="Сумма"
            value={purchaseAmount}
            onChange={(e) => setPurchaseAmount(e.target.value)}
            style={{ padding: 8, width: "100%", marginBottom: 10 }}
          />
          <button onClick={handleAddPurchase} disabled={!purchaseAmount || !purchaseDescription}>
            Добавить покупку
          </button>
        </div>
      )}

      <h2 style={{ marginTop: 30 }}>Покупки</h2>
      <ul>
        {purchases.map((purchase, idx) => {
          const cat = categories[purchase.categoryIndex];
          return (
            <li key={idx}>
              <b>{cat.icon} {cat.name}:</b> {purchase.description} — {purchase.amount} RSD
            </li>
          );
        })}
      </ul>

      {showAddModal && (
        <AddCategoryModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddCategory}
        />
      )}
    </div>
  );
}

export default CategoriesView;
