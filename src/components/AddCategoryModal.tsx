import React, { useState } from "react";
import Select from "react-select";
import { iconOptions } from "../constants/iconOptions";

interface AddCategoryModalProps {
  onClose: () => void;
  onAdd: (name: string, icon: string) => void;
}

export default function AddCategoryModal({ onClose, onAdd }: AddCategoryModalProps) {
  const [name, setName] = useState("");
  const [iconName, setIconName] = useState<string>("Circle");

  const handleSubmit = () => {
    if (!name.trim()) return;
    onAdd(name.trim(), iconName);
    setName("");
    setIconName("Circle");
    onClose();
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h3 style={styles.header}>Новая категория</h3>

        <label style={styles.label}>Название</label>
        <input
          style={styles.input}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Пример: Еда"
        />

        <label style={styles.label}>Иконка</label>
        <Select
          options={iconOptions}
          value={iconOptions.find((opt) => opt.name === iconName)}
          onChange={(selected) => selected && setIconName(selected.name)}
          formatOptionLabel={(option) => (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <option.icon size={18} />
              {option.label}
            </div>
          )}
          styles={{
            option: (base) => ({ ...base, display: "flex", alignItems: "center", gap: 8 }),
          }}
        />

        <div style={styles.buttons}>
          <button onClick={handleSubmit}>Добавить</button>
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
  label: {
    fontSize: 14,
    marginTop: 8,
  },
  input: {
    width: "100%",
    padding: 6,
    marginTop: 4,
    marginBottom: 12,
  },
  buttons: {
    display: "flex",
    justifyContent: "space-between",
    gap: 8,
    marginTop: 12,
  },
};
