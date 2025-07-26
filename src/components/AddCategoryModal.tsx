import React, { useState, useRef, useEffect } from "react";
import { iconMap } from "../constants/iconOptions";
import CustomAlphaKeyboard from "./CustomAlphaKeyboard";

interface AddCategoryModalProps {
  onClose: () => void;
  onAdd: (name: string, icon: string) => void;
}

const AddCategoryModal: React.FC<AddCategoryModalProps> = ({ onClose, onAdd }) => {
  const [name, setName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState<string>("shopping"); // дефолтная иконка
  const [showDropdown, setShowDropdown] = useState(false);
  const [showAlphaKeyboard, setShowAlphaKeyboard] = useState(false);

  const modalRef = useRef<HTMLDivElement>(null);
  const keyboardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (
        modalRef.current &&
        !modalRef.current.contains(target) &&
        keyboardRef.current &&
        !keyboardRef.current.contains(target)
      ) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

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

  const handleAdd = () => {
    if (!name || !selectedIcon) return;
    onAdd(name, selectedIcon);
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
      {/* Модальное окно */}
      <div
        ref={modalRef}
        onClick={(e) => e.stopPropagation()} // чтобы клики внутри модалки не закрывали ее
        style={{
          backgroundColor: "white",
          padding: 20,
          borderRadius: 12,
          width: 350,
          display: "flex",
          flexDirection: "column",
          gap: 16,
          position: "relative",
          zIndex: 201,
        }}
      >
        <h3 style={{ margin: 0 }}>Добавить категорию</h3>

        {/* Название и иконка в одной строке */}
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          {/* Поле для имени категории */}
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
              cursor: "text",
              backgroundColor: "#f7f7f7",
              userSelect: "none",
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
                  zIndex: 202,
                  maxHeight: 200,
                  overflowY: "auto",
                  transformOrigin: "top right",
                }}
                onClick={(e) => e.stopPropagation()}
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

        {/* Кнопка добавления */}
        <button
          onClick={handleAdd}
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
        >
          Добавить
        </button>

        <button
          onClick={onClose}
          style={{
            marginTop: 8,
            padding: "10px 0",
            background: "#f1f1f1",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
          }}
        >
          Отмена
        </button>
      </div>

      {/* Клавиатура с анимацией */}
      <div
        ref={keyboardRef}
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 150,
          transition: "transform 0.3s ease, opacity 0.3s ease",
          transform: showAlphaKeyboard ? "translateY(0)" : "translateY(100%)",
          opacity: showAlphaKeyboard ? 1 : 0,
          backgroundColor: "#ddd",
        }}
      >
        <CustomAlphaKeyboard onKeyPress={handleAlphaKeyboardInput} />
      </div>
    </div>
  );
};

export default AddCategoryModal;
