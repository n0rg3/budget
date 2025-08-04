import React, { useState } from "react";

interface CustomAlphaKeyboardProps {
  onKeyPress: (key: string) => void;
  visible?: boolean;
}

const layouts = {
  ru: ["йцукенгшщзхъ", "фывапролджэ", "ячсмитьбю"],
  en: ["qwertyuiop", "asdfghjkl", "zxcvbnm"],
};

const CustomAlphaKeyboard: React.FC<CustomAlphaKeyboardProps> = ({ onKeyPress, visible = false }) => {
  const [layout, setLayout] = useState<"ru" | "en">("ru");
  const [isShift, setIsShift] = useState(false);

  const toggleLayout = () => setLayout((prev) => (prev === "ru" ? "en" : "ru"));

  return (
    <div
      style={{
        backgroundColor: "#ddd",
        padding: 10,
        userSelect: "none",
        display: "flex",
        flexDirection: "column",
        gap: 6,
        transform: visible ? "translateY(0)" : "translateY(100%)",
        opacity: visible ? 1 : 0,
        transition: "transform 0.3s ease, opacity 0.3s ease",
      }}
    >
      {layouts[layout].map((row, i) => {
        const isThirdRow = i === 2;
        const chars = row.split("");

        return (
          <div key={i} style={{ display: "flex", gap: 6, justifyContent: "center" }}>
            {isThirdRow && (
              <button
                key="Shift"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsShift((prev) => !prev);
                }}
                style={{
                  flex: 1,
                  padding: "8px 0",
                  fontSize: 16,
                  borderRadius: 6,
                  border: "1px solid #aaa",
                  backgroundColor: isShift ? "#bbb" : "#eee",
                  cursor: "pointer",
                  userSelect: "none",
                }}
              >
                Shift
              </button>
            )}

            {chars.map((char) => (
              <button
                key={char}
                onClick={(e) => {
                  e.stopPropagation();
                  const symbol = isShift ? char.toUpperCase() : char;
                  onKeyPress(symbol);
                  if (isShift) setIsShift(false);
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
                {isShift ? char.toUpperCase() : char}
              </button>
            ))}

            {isThirdRow && (
              <button
                key="⌫"
                onClick={(e) => {
                  e.stopPropagation();
                  onKeyPress("⌫");
                }}
                style={{
                  flex: 1,
                  padding: "8px 0",
                  fontSize: 16,
                  borderRadius: 6,
                  border: "1px solid #aaa",
                  backgroundColor: "#eee",
                  cursor: "pointer",
                  userSelect: "none",
                }}
              >
                ⌫
              </button>
            )}
          </div>
        );
      })}

      <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
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

        <button
          onClick={(e) => {
            e.stopPropagation();
            onKeyPress(" ");
          }}
          style={{
            flex: 3,
            padding: "8px 0",
            fontSize: 16,
            borderRadius: 6,
            border: "1px solid #aaa",
            backgroundColor: "#fff",
            cursor: "pointer",
            userSelect: "none",
          }}
        >
          Пробел
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onKeyPress("Ввод");
          }}
          style={{
            flex: 1,
            padding: "8px 0",
            fontSize: 16,
            borderRadius: 6,
            border: "1px solid #aaa",
            backgroundColor: "#007bff",
            color: "white",
            cursor: "pointer",
            userSelect: "none",
          }}
        >
          Ввод
        </button>
      </div>
    </div>
  );
};

export default CustomAlphaKeyboard;
