import React, { useState, useEffect } from "react";

const OPTIONS = ["PC", "Xbox", "PlayStation"];

export default function PlataformFilter({
  selectedPlatforms = [],
  onPlatformChange = () => {},
  isMenuOpen,
  onBack,
}) {
  const [selected, setSelected] = useState(selectedPlatforms);
  useEffect(() => setSelected(selectedPlatforms || []), [selectedPlatforms]);

  const toggle = (opt) => {
    const next = selected.includes(opt)
      ? selected.filter((s) => s !== opt)
      : [...selected, opt];
    setSelected(next);
    onPlatformChange(next);
  };

  return (
    <div className="filter plataform-filter">
      <div className="back-button-container">
        <button className="back-button" onClick={onBack}>
          ← Volver a Filtros
        </button>
      </div>
      <div style={{ display: isMenuOpen ? "block" : "none" }}>
        {OPTIONS.map((opt) => (
          <label key={opt} style={{ display: "block" }}>
            <input
              type="checkbox"
              checked={selected.includes(opt)}
              onChange={() => toggle(opt)}
            />{" "}
            {opt}
          </label>
        ))}
      </div>
    </div>
  );
}
