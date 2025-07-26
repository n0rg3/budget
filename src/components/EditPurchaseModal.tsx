import React, { useState, useRef, useEffect } from "react";
import type { Purchase } from "../types";
import CustomNumericKeyboard from "./CustomNumericKeyboard";
import CustomAlphaKeyboard from "./CustomAlphaKeyboard";

interface EditPurchaseModalProps {
  purchase: Purchase;
  categories: string[];
  onClose: () => void;
  onSave: (updated: Purchase) => void;
  onDelete: () => void;
}

export default function EditPurchaseModal({
  purchase,
  categories,
  onClose,
  onSave,
  onDelete,
}: EditPurchaseModalProps) {
  const [name, setName] = useState(purchase.name);
  const [category, setCategory] = useState(purchase.category);
  const [amount, setAmount] = useState(purchase.amount.toFixed(0));
  const [keyboardVisible, setKeyboardVisible] = useState<"none" | "alpha" | "numeric">("none");
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        modalRef.current && !modalRef.current.contains(event.target as Node) &&
        !(event.target instanceof HTMLElement &&
          (event.target.closest(".custom-numeric-keyboard") || event.target.closest(".custom-alpha-keyboard")))
      ) {
        setKeyboardVisible("none");
      }
    }
    if (keyboardVisible !== "none") {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [keyboardVisible]);

  const handleSave = () => {
    if (!name.trim() || !category.trim() || isNaN(Number(amount)) || Number(amount) < 0) {
      alert("Пожалуйста, введите корректные данные");
      return;
    }
    onSave({ ...purchase, name, category, amount: Number(amount) });
    setKeyboardVisible("none");
  };

  const handleAlphaKeyPress = (key: string) => {
    if (key === "Ввод") {
      setKeyboardVisible("none");
      return;
    }
    if (key === "⌫") {
      setName((prev) => prev.slice(0, -1));
      return;
    }
    if (key === " ") {
      setName((prev) => prev + " ");
      return;
    }
    setName((prev) => prev + key);
  };

  const handleNumericKeyPress = (key: string) => {
    if (key === "Ввод") {
      setKeyboardVisible("none");
      return;
    }
    if (key === "⌫") {
      setAmount((prev) => (prev.length > 1 ? prev.slice(0, -1) : "0"));
      return;
    }
    if ("0123456789".includes(key)) {
      setAmount((prev) => (prev === "0" ? key : prev + key));
      return;
    }
  };

  // Общий стиль для клавиатуры с анимацией
  const keyboardStyle = (visible: boolean) => ({
    position: "fixed" as const,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 300,
    backgroundColor: "#ddd",
    transition: "transform 0.3s ease, opacity 0.3s ease",
    transform: visible ? "translateY(0)" : "translateY(100%)",
    opacity: visible ? 1 : 0,
  });

  return (
    <>
      <div
        style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 200,
        }}
        onClick={onClose}
      >
        <div
          ref={modalRef}
          onClick={(e) => e.stopPropagation()}
          style={{
            background: "white",
            borderRadius: 8,
            padding: 24,
            width: 320,
            boxSizing: "border-box",
            boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
            userSelect: "none",
            position: "relative",
            zIndex: 201,
          }}
        >
          <h3 style={{ marginTop: 0, marginBottom: 16 }}>Редактировать покупку</h3>

          <label>
            Описание
            <input
              type="text"
              value={name}
              readOnly
              onClick={() => setKeyboardVisible("alpha")}
              style={{
                width: "100%",
                marginBottom: 12,
                padding: 6,
                cursor: "text",
                backgroundColor: "#f7f7f7",
              }}
            />
          </label>

          <label>
            Категория
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{ width: "100%", marginBottom: 12, padding: 6 }}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </label>

          <label>
            Сумма (RSD)
            <input
              type="text"
              value={amount}
              readOnly
              onClick={() => setKeyboardVisible("numeric")}
              style={{
                width: "100%",
                marginBottom: 12,
                padding: 6,
                fontSize: 18,
                letterSpacing: 2,
                textAlign: "right",
                userSelect: "none",
                backgroundColor: "#f7f7f7",
                cursor: "pointer",
              }}
            />
          </label>

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <button
              onClick={onDelete}
              style={{
                backgroundColor: "#f44336",
                color: "white",
                padding: "8px 12px",
                border: "none",
                borderRadius: 4,
                cursor: "pointer",
              }}
              type="button"
            >
              Удалить
            </button>
            <div>
              <button
                onClick={onClose}
                style={{ marginRight: 8, padding: "8px 12px", cursor: "pointer" }}
                type="button"
              >
                Отмена
              </button>
              <button
                onClick={handleSave}
                style={{ padding: "8px 12px", cursor: "pointer" }}
                type="button"
              >
                Сохранить
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Алфавитная клавиатура */}
      <div
        className="custom-alpha-keyboard"
        onClick={(e) => e.stopPropagation()}
        style={keyboardStyle(keyboardVisible === "alpha")}
      >
        <CustomAlphaKeyboard onKeyPress={handleAlphaKeyPress} />
      </div>

      {/* Цифровая клавиатура */}
      <div
        className="custom-numeric-keyboard"
        onClick={(e) => e.stopPropagation()}
        style={keyboardStyle(keyboardVisible === "numeric")}
      >
        <CustomNumericKeyboard onKeyPress={handleNumericKeyPress} />
      </div>
    </>
  );
}
