import React from "react";

const BEFilter = ({ selectedBE = [], onBEChange, onBack }) => {
  const options = [
    { label: "0 - 10,000", code: "0-10000", min: 0, max: 10000 },
    { label: "10,000 - 30,000", code: "10000-30000", min: 10000, max: 30000 },
    { label: "30,000 - 60,000", code: "30000-60000", min: 30000, max: 60000 },
    {
      label: "60,000 - 100,000",
      code: "60000-100000",
      min: 60000,
      max: 100000,
    },
    { label: "100,000+", code: "100000+", min: 100000, max: Infinity },
  ];

  const toggleOption = (code) => {
    const exists = selectedBE.includes(code);
    const next = exists
      ? selectedBE.filter((c) => c !== code)
      : [...selectedBE, code];
    onBEChange(next);
  };

  return (
    <div className="filter-panel">
      <button className="back-button" onClick={onBack}>
        ← Volver a filtros
      </button>
      <h3 style={{ textAlign: "center" }}>Blue Essence</h3>
      <ul className="level-options">
        {options.map((opt) => {
          const id = `be-${opt.code}`;
          const checked = selectedBE.includes(opt.code);
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

export default BEFilter;
