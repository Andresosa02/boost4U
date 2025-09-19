import React from "react";

const RPFilter = ({ selectedRP = [], onRPChange, onBack }) => {
  const options = [
    { label: "0 - 400", code: "0-400", min: 0, max: 400 },
    { label: "400 - 1,000", code: "400-1000", min: 400, max: 1000 },
    { label: "1,000 - 4,000", code: "1000-4000", min: 1000, max: 4000 },
    { label: "4,000 - 10,000", code: "4000-10000", min: 4000, max: 10000 },
    { label: "10,000 - 20,000", code: "10000-20000", min: 10000, max: 20000 },
    { label: "20,000+", code: "20000+", min: 20000, max: Infinity },
  ];

  const toggleOption = (code) => {
    const exists = selectedRP.includes(code);
    const next = exists
      ? selectedRP.filter((c) => c !== code)
      : [...selectedRP, code];
    onRPChange(next);
  };

  return (
    <div className="filter-panel">
      <button className="back-button" onClick={onBack}>
        ← Volver a filtros
      </button>
      <h3 style={{ textAlign: "center" }}>Riot Points</h3>
      <ul className="level-options">
        {options.map((opt) => {
          const id = `rp-${opt.code}`;
          const checked = selectedRP.includes(opt.code);
          return (
            <li key={opt.code} className="level-option">
              <label
                htmlFor={id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  cursor: "pointer",
                }}
              >
                <input
                  id={id}
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleOption(opt.code)}
                />
                <span>{opt.label}</span>
                {checked && <span aria-hidden="true"> ✓</span>}
              </label>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default RPFilter;
