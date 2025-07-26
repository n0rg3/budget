import React, { useState } from "react";
import { iconMap } from "../constants/iconOptions";
import CustomAlphaKeyboard from "./CustomAlphaKeyboard";
import type { Category, Purchase } from "../types";

interface EditCategoryModalProps {
  category: Category;
  purchases: Purchase[];
  onClose: () => void;
  onSave: (updated: Category) => void;
  onDelete: () => void;
}

const EditCategoryModal: React.FC<EditCategoryModalProps> = ({
  category,
  purchases,
  onClose,
  onSave,
  onDelete,
}) => {
  const [name, setName] = useState(category.name);
  const [selectedIcon, setSelectedIcon] = useState<string>(category.icon);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showAlphaKeyboard, setShowAlphaKeyboard] = useState(false);

  const categoryPurchases = purchases.filter((p) => p.category === category.name);

  const handleAlphaKeyboardInput = (key: string) => {
    if (key === "⌫") {
      setName((prev) => prev.slice(0, -1));
    } else if (key === "Space") {
      setName((prev) => prev + " ");
    } else if (key === "Ввод") {
      setShowAlphaKeyboard(false);
    } else {
      setName((prev) => prev + key);
    }
  };

  const handleSave = () => {
    if (!name || !selectedIcon) return;
    onSave({ name, icon: selectedIcon });
  };

  const handleOverlayClick = () => {
    setShowAlphaKeyboard(false);
    setShowDropdown(false);
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.4)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 200,
      }}
    >
      {/* Overlay */}
      {(showAlphaKeyboard || showDropdown) && (
        <div
          onClick={handleOverlayClick}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 90,
            backgroundColor: "transparent",
          }}
        />
      )}

      {/* Модальное окно */}
      <div
        style={{
          backgroundColor: "white",
          padding: 20,
          borderRadius: 12,
          width: 350,
          display: "flex",
          flexDirection: "column",
          gap: 16,
          position: "relative",
          zIndex: 100,
          maxHeight: "80vh",
          overflowY: "auto",
        }}
      >
        <h3 style={{ margin: 0 }}>Редактировать категорию</h3>

        {/* Контейнер с названием и иконкой в одной строке */}
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          {/* Название категории */}
          <input
            type="text"
            placeholder="Название категории"
            value={name}
            readOnly
            onFocus={() => setShowAlphaKeyboard(true)}
            style={{
              flexGrow: 1,
              padding: 10,
              fontSize: 16,
              border: "1px solid #ccc",
              borderRadius: 6,
            }}
          />

          {/* Кастомный dropdown только с иконками */}
          <div style={{ position: "relative", width: 60 }}>
            <div
              onClick={() => setShowDropdown((prev) => !prev)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                height: 44,
                border: "1px solid #ccc",
                borderRadius: 6,
                cursor: "pointer",
                backgroundColor: "#f9f9f9",
                userSelect: "none",
              }}
            >
              {iconMap[selectedIcon] && React.createElement(iconMap[selectedIcon], { size: 28 })}
            </div>

            {showDropdown && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  right: 0,
                  left: "auto",
                  backgroundColor: "#fff",
                  border: "1px solid #ccc",
                  borderRadius: 6,
                  padding: 10,
                  display: "grid",
                  gridTemplateColumns: "repeat(5, 1fr)",
                  gap: 12,
                  zIndex: 200,
                  maxHeight: 200,
                  overflowY: "auto",
                  transformOrigin: "top right",
                }}
              >
                {Object.keys(iconMap).map((iconKey) => (
                  <div
                    key={iconKey}
                    onClick={() => {
                      setSelectedIcon(iconKey);
                      setShowDropdown(false);
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 40,
                      height: 40,
                      borderRadius: 8,
                      border:
                        iconKey === selectedIcon
                          ? "2px solid #007bff"
                          : "1px solid #ccc",
                      backgroundColor: "#f9f9f9",
                      cursor: "pointer",
                      userSelect: "none",
                    }}
                  >
                    {iconMap[iconKey] && React.createElement(iconMap[iconKey], { size: 20 })}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Список покупок в категории */}
        <div style={{ fontWeight: "bold", fontSize: 14, marginTop: 12 }}>
          Покупки в этой категории:
        </div>
        <ul
          style={{
            fontSize: 13,
            maxHeight: 100,
            overflowY: "auto",
            marginTop: 4,
            marginBottom: 8,
            paddingLeft: 20,
          }}
        >
          {categoryPurchases.length === 0 && <li>Покупок нет</li>}
          {categoryPurchases.map((p) => (
            <li key={p.id}>
              {p.name} — {p.amount.toFixed(0)} RSD
            </li>
          ))}
        </ul>

        {/* Кнопки */}
        <button
          onClick={handleSave}
          style={{
            width: "100%",
            padding: "12px 0",
            background: "#007bff",
            color: "white",
            fontSize: 16,
            border: "none",
            borderRadius: 8,
            cursor: name && selectedIcon ? "pointer" : "not-allowed",
            opacity: name && selectedIcon ? 1 : 0.5,
          }}
          disabled={!name || !selectedIcon}
        >
          Сохранить
        </button>

        <button
          onClick={onDelete}
          style={{
            padding: "12px 0",
            background: "#dc3545",
            color: "white",
            fontSize: 16,
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
            marginTop: 8,
          }}
        >
          Удалить
        </button>

        <button
          onClick={onClose}
          style={{
            marginTop: 8,
            padding: "12px 0",
            background: "#f1f1f1",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
            fontSize: 16,
          }}
        >
          Отмена
        </button>
      </div>

      {/* Клавиатура */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 150,
          transition: "transform 0.3s ease, opacity 0.3s ease",
          transform: showAlphaKeyboard ? "translateY(0)" : "translateY(100%)",
          opacity: showAlphaKeyboard ? 1 : 0,
        }}
      >
        <CustomAlphaKeyboard onKeyPress={handleAlphaKeyboardInput} />
      </div>
    </div>
  );
};

export default EditCategoryModal;
