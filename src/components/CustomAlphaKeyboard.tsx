import React, { useState } from "react";

interface CustomAlphaKeyboardProps {
  onKeyPress: (key: string) => void;
}

// Русская и английская раскладки по строкам
const layouts = {
  ru: [
    "йцукенгшщзхъ",
    "фывапролджэ",
    "ячсмитьбю",
  ],
  en: [
    "qwertyuiop",
    "asdfghjkl",
    "zxcvbnm",
  ],
};

const controlKeys = ["Space", "⌫", "Ввод"];

const CustomAlphaKeyboard: React.FC<CustomAlphaKeyboardProps> = ({ onKeyPress }) => {
  const [layout, setLayout] = useState<"ru" | "en">("ru");

  const toggleLayout = () => {
    setLayout((prev) => (prev === "ru" ? "en" : "ru"));
  };

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
      {layouts[layout].map((row, i) => (
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
                textTransform: layout === "en" ? "lowercase" : "none",
              }}
            >
              {char}
            </button>
          ))}
        </div>
      ))}

      {/* Последняя строка с кнопками */}
      <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
        {controlKeys.map((key) => (
          <button
            key={key}
            onClick={(e) => {
              e.stopPropagation();
              if (key === "Space") onKeyPress(" ");
              else onKeyPress(key);
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

        {/* Кнопка переключения раскладки */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleLayout();
          }}
          style={{
            flex: 1,
            padding: "8px 0",
            fontSize: 16,
            borderRadius: 6,
            border: "1px solid #aaa",
            backgroundColor: "#4caf50",
            color: "white",
            cursor: "pointer",
            userSelect: "none",
          }}
        >
          {layout === "ru" ? "EN" : "RU"}
        </button>
      </div>
    </div>
  );
};

export default CustomAlphaKeyboard;
