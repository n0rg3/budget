// EditCategoryModal.tsx с react-select и иконками
import React, { useState } from "react";
import type { Category, Purchase } from "../types";
import { iconOptions } from "../constants/iconOptions";
import Select from "react-select";

interface EditCategoryModalProps {
//   isOpen: boolean;
  category: Category;
  purchases: Purchase[];
  onClose: () => void;
  onSave: (updated: Category) => void;
  onDelete: () => void;
}

export default function EditCategoryModal({
  category,
  purchases,
  onClose,
  onSave,
  onDelete,
}: EditCategoryModalProps) {
  const [name, setName] = useState(category.name);
  const [icon, setIcon] = useState(category.icon);

  const categoryPurchases = purchases.filter((p) => p.category === category.name);

  const iconSelectOptions = iconOptions.map((opt) => ({
    value: opt.name,
    label: (
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {/* {React.createElement(FaIcons[opt.name as keyof typeof FaIcons])} */}
        <span>{opt.label}</span>
      </div>
    ),
  }));

  const selectedIcon = iconSelectOptions.find((opt) => opt.value === icon);

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h3 style={styles.header}>Редактировать категорию</h3>

        <label style={styles.label}>Название</label>
        <input
          style={styles.input}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label style={styles.label}>Иконка</label>
        <Select
          options={iconSelectOptions}
          value={selectedIcon}
          onChange={(selected) => setIcon(selected?.value || "")}
        />

        <div style={styles.subHeader}>Покупки в этой категории:</div>
        <ul style={styles.list}>
          {categoryPurchases.map((p) => (
            <li key={p.id}>
              {p.name} — {p.amount.toFixed(0)} RSD
            </li>
          ))}
        </ul>

        <div style={styles.buttons}>
          <button onClick={() => onSave({ name, icon })}>Сохранить</button>
          <button onClick={onDelete} style={{ color: "red" }}>Удалить</button>
          <button onClick={onClose}>Отмена</button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed" as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.3)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  modal: {
    background: "white",
    padding: 20,
    borderRadius: 12,
    maxWidth: 300,
    width: "90%",
  },
  header: {
    fontSize: 18,
    marginBottom: 12,
  },
  subHeader: {
    fontSize: 14,
    marginTop: 16,
    fontWeight: "bold",
  },
  label: {
    fontSize: 14,
    marginTop: 8,
  },
  input: {
    width: "100%",
    padding: 6,
    marginTop: 4,
    marginBottom: 8,
  },
  list: {
    fontSize: 13,
    maxHeight: 100,
    overflowY: "auto" as const,
    marginTop: 4,
    marginBottom: 8,
  },
  buttons: {
    display: "flex",
    justifyContent: "space-between",
    gap: 8,
  },
};
