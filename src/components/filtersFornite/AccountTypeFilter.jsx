import React, { useState, useEffect, useRef } from "react";

const OPTIONS = [
  "OG Account",
  "Original Email",
  "Stacked",
  "Save The World",
  "Battle Royale",
  "The Crew",
];

export default function AccountTypeFilter({
  selectedAccountType = [],
  onAccountTypeChange = () => {},
  isOpen,
  onToggleOpen = () => {},
}) {
  const [selected, setSelected] = useState(selectedAccountType);
  const [expandedFaq] = useState(true);
  const moreFiltersDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isOpen &&
        moreFiltersDropdownRef.current &&
        !moreFiltersDropdownRef.current.contains(event.target)
      ) {
        onToggleOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onToggleOpen]);

  useEffect(
    () => setSelected(selectedAccountType || []),
    [selectedAccountType]
  );

  const toggle = (opt) => {
    const next = selected.includes(opt)
      ? selected.filter((s) => s !== opt)
      : [...selected, opt];
    setSelected(next);
    onAccountTypeChange(next);
  };

  return (
    <div className="filter accounttype-filter" ref={moreFiltersDropdownRef}>
      <button
        className="dropdown-button-fornite tipocuentas"
        type="button"
        onClick={() => onToggleOpen(!isOpen)}
      >
        <span>Tipo de cuenta</span>
        <img
          src="../../../images/abajo.png"
          className={`faq-arrow-lol ${
            expandedFaq === isOpen ? "expanded-lol" : ""
          }`}
        />
      </button>
      <div
        className="dropdown-menu"
        style={{ display: isOpen ? "block" : "none" }}
      >
        {OPTIONS.map((opt) => (
          <ul>
            <li key={opt} style={{ display: "block" }}>
              <input
                type="checkbox"
                checked={selected.includes(opt)}
                onChange={() => toggle(opt)}
              />{" "}
              {opt}
            </li>
          </ul>
        ))}
      </div>
    </div>
  );
}
