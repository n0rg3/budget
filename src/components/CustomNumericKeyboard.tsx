import React from "react";

interface KeyboardProps {
  onKeyPress: (key: string) => void;
}

const keys = [
  ["7", "8", "9", "+"],
  ["4", "5", "6", "-"],
  ["1", "2", "3", "*"],
  ["Ввод", "0", "⌫", "/"]
];

const CustomNumericKeyboard: React.FC<KeyboardProps> = ({ onKeyPress }) => {
  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        background: "#fff",
        boxShadow: "0 -2px 5px rgba(0,0,0,0.1)",
        padding: "10px 10px",
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "10px",
        zIndex: 1100,
      }}
    >
      {keys.flat().map((key, i) => (
        <button
          key={i}
          onClick={() => onKeyPress(key)}
          style={{
            padding: "14px 0",
            fontSize: 18,
            background: key === "Ввод" ? "#007bff" : "#f9f9f9",
            color: key === "Ввод" ? "#fff" : "#333",
            border: "1px solid #ccc",
            borderRadius: 8,
            cursor: "pointer",
            fontWeight: key === "Ввод" ? "bold" : "normal",
          }}
        >
          {key}
        </button>
      ))}
    </div>
  );
};

export default CustomNumericKeyboard;
