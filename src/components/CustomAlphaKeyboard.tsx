import React from "react";

interface CustomAlphaKeyboardProps {
  onKeyPress: (key: string) => void;
}

// Можно сделать алфавит по строкам
const rows = [
  "йцукенгшщзхъ",
  "фывапролджэ",
  "ячсмитьбю",
  "Space", "⌫", "Ввод"
];

const CustomAlphaKeyboard: React.FC<CustomAlphaKeyboardProps> = ({ onKeyPress }) => {
  return (
    <div
      style={{
        backgroundColor: "#ddd",
        padding: 10,
        userSelect: "none",
        display: "flex",
        flexDirection: "column",
        gap: 6,
      }}
    >
      {rows.slice(0, 3).map((row, i) => (
        <div key={i} style={{ display: "flex", gap: 6, justifyContent: "center" }}>
          {row.split("").map((char) => (
            <button
              key={char}
              onClick={(e) => {
                e.stopPropagation();
                onKeyPress(char);
              }}
              style={{
                flex: 1,
                padding: "8px 0",
                fontSize: 16,
                borderRadius: 6,
                border: "1px solid #aaa",
                backgroundColor: "#fff",
                cursor: "pointer",
                userSelect: "none",
              }}
            >
              {char}
            </button>
          ))}
        </div>
      ))}
      {/* Последняя строка с кнопками */}
      <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
        {rows[3].split(" ").map((key) => (
          <button
            key={key}
            onClick={(e) => {
              e.stopPropagation();
              onKeyPress(key);
            }}
            style={{
              flex: key === "Space" ? 3 : 1,
              padding: "8px 0",
              fontSize: 16,
              borderRadius: 6,
              border: "1px solid #aaa",
              backgroundColor: key === "Ввод" ? "#007bff" : "#fff",
              color: key === "Ввод" ? "white" : "black",
              cursor: "pointer",
              userSelect: "none",
            }}
          >
            {key === "Space" ? "Пробел" : key}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CustomAlphaKeyboard;
