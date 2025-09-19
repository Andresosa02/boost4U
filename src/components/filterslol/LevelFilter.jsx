import React from "react";

const LevelFilter = ({ selectedLevel = [], onLevelChange, onBack }) => {
  const options = [
    { label: "Level 1 - 29", code: "1-29", min: 1, max: 29 },
    { label: "Level 30 - 50", code: "30-50", min: 30, max: 50 },
    { label: "Level 50 - 100", code: "50-100", min: 50, max: 100 },
    { label: "Level 100 - 200", code: "100-200", min: 100, max: 200 },
    { label: "Level 200+", code: "200+", min: 200, max: Infinity },
  ];

  const toggleOption = (code) => {
    const exists = selectedLevel.includes(code);
    const next = exists
      ? selectedLevel.filter((c) => c !== code)
      : [...selectedLevel, code];
    onLevelChange(next);
  };

  return (
    <div className="filter-panel">
      <button className="back-button" onClick={onBack}>
        ← Volver a filtros
      </button>
      <h3 style={{ textAlign: "center" }}>Level</h3>
      <ul className="level-options">
        {options.map((opt) => {
          const id = `level-${opt.code}`;
          const checked = selectedLevel.includes(opt.code);
          return (
            <li key={opt.code} className="level-option">
              <input
                id={id}
                type="checkbox"
                checked={checked}
                onChange={() => toggleOption(opt.code)}
              />
              <span>{opt.label}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default LevelFilter;
