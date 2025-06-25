// src/components/AddCategoryModal.tsx
import React, { useState } from "react";
import * as FaIcons from "react-icons/fa";

type Props = {
  onClose: () => void;
  onAdd: (name: string, icon: string) => void;
};

const iconNames = Object.keys(FaIcons).filter((name) => name.startsWith("Fa"));

const AddCategoryModal: React.FC<Props> = ({ onClose, onAdd }) => {
  const [name, setName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("FaApple");

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: 20,
          borderRadius: 12,
          width: "90%",
          maxWidth: 400,
          maxHeight: "90%",
          overflow: "auto",
        }}
      >
        <h3>Новая категория</h3>
        <input
          type="text"
          placeholder="Название"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{
            width: "100%",
            padding: 8,
            marginBottom: 12,
            borderRadius: 6,
            border: "1px solid #ccc",
          }}
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(40px, 1fr))",
            gap: 8,
            maxHeight: 200,
            overflowY: "scroll",
            marginBottom: 12,
          }}
        >
          {iconNames.map((iconName) => {
            const Icon = FaIcons[iconName as keyof typeof FaIcons];
            return (
              <div
                key={iconName}
                onClick={() => setSelectedIcon(iconName)}
                style={{
                  padding: 6,
                  border: selectedIcon === iconName ? "2px solid #007aff" : "2px solid transparent",
                  borderRadius: 8,
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Icon />
              </div>
            );
          })}
        </div>

        <button
          onClick={() => {
            if (name) onAdd(name, selectedIcon);
          }}
          style={{
            background: "#007aff",
            color: "#fff",
            padding: 10,
            borderRadius: 8,
            border: "none",
            width: "100%",
            fontWeight: "bold",
          }}
        >
          Добавить
        </button>

        <button
          onClick={onClose}
          style={{
            marginTop: 10,
            color: "#007aff",
            background: "transparent",
            border: "none",
            width: "100%",
          }}
        >
          Отмена
        </button>
      </div>
    </div>
  );
};

export default AddCategoryModal;
