import React, { useState } from "react";

interface AddCategoryModalProps {
  onClose: () => void;
  onAdd: (name: string, icon: string) => void;
}

const AddCategoryModal: React.FC<AddCategoryModalProps> = ({ onClose, onAdd }) => {
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && icon.trim()) {
      onAdd(name.trim(), icon.trim());
    }
  };

  return (
    <div style={{
      position: "fixed",
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: "rgba(0,0,0,0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
    }}>
      <form onSubmit={handleSubmit} style={{
        backgroundColor: "white",
        padding: 20,
        borderRadius: 8,
        minWidth: 300,
        boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
      }}>
        <h2>Добавить категорию</h2>
        <input
          type="text"
          placeholder="Название"
          value={name}
          onChange={e => setName(e.target.value)}
          style={{ width: "100%", marginBottom: 10, padding: 8 }}
        />
        <input
          type="text"
          placeholder="Иконка (например 🛒)"
          value={icon}
          onChange={e => setIcon(e.target.value)}
          style={{ width: "100%", marginBottom: 10, padding: 8 }}
        />
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
          <button type="button" onClick={onClose}>Отмена</button>
          <button type="submit">Добавить</button>
        </div>
      </form>
    </div>
  );
};

export default AddCategoryModal;
