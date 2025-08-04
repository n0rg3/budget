import React from "react";

interface CustomNumericKeyboardProps {
  onKeyPress: (key: string) => void;
  visible?: boolean;
}

const keys = [
  "1", "2", "3", "+",
  "4", "5", "6", "-",
  "7", "8", "9", "*",
  "Ввод", "0", "⌫", "/",
];

const CustomNumericKeyboard: React.FC<CustomNumericKeyboardProps> = ({ onKeyPress, visible = true }) => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: 8,
        padding: 10,
        backgroundColor: "#ddd",
        userSelect: "none",

        // Анимация появления
        transform: visible ? "translateY(0)" : "translateY(100%)",
        opacity: visible ? 1 : 0,
        transition: "transform 0.3s ease, opacity 0.3s ease",
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 300,
      }}
    >
      {keys.map((key) => (
        <button
          key={key}
          onClick={(e) => {
            e.stopPropagation();
            onKeyPress(key);
          }}
          style={{
            fontSize: 18,
            padding: "12px 0",
            borderRadius: 6,
            border: "1px solid #aaa",
            backgroundColor: key === "Ввод" ? "#007bff" : "#fff",
            color: key === "Ввод" ? "white" : "black",
            cursor: "pointer",
          }}
        >
          {key}
        </button>
      ))}
    </div>
  );
};

export default CustomNumericKeyboard;
