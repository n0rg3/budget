import React from "react";

interface CustomNumericKeyboardProps {
  onKeyPress: (key: string) => void;
}

const keys = [
  "1", "2", "3", "+",
  "4", "5", "6", "-",
  "7", "8", "9", "*",
  "Ввод", "0", "⌫", "/",
];

const CustomNumericKeyboard: React.FC<CustomNumericKeyboardProps> = ({ onKeyPress }) => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: 8,
        padding: 10,
        backgroundColor: "#ddd",
        userSelect: "none",
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
