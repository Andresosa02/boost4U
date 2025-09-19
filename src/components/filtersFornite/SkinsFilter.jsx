// src/components/filters/SkinsFilter.jsx
import React, { useState, useEffect, useRef } from "react";

const OPTIONS = ["1-50", "50-100", "100-200", "200-500", "500+"];

const SkinsFilter = ({
  selectedSkins = [],
  onSkinsChange = () => {},
  isOpen = false,
  onToggleOpen = () => {},
}) => {
  const [selected, setSelected] = useState(selectedSkins || []);
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

  useEffect(() => setSelected(selectedSkins || []), [selectedSkins]);

  const toggle = (opt) => {
    const next = selected.includes(opt)
      ? selected.filter((s) => s !== opt)
      : [...selected, opt];
    setSelected(next);
    onSkinsChange(next);
  };

  return (
    <div className="filter-item skins-filter" ref={moreFiltersDropdownRef}>
      <button
        className="dropdown-button-fornite"
        type="button"
        onClick={() => onToggleOpen(!isOpen)}
      >
        Skins
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
            <li
              key={opt}
              className="filter-option"
              style={{ display: "block" }}
            >
              <input
                checked={selected.includes(opt)}
                onChange={() => toggle(opt)}
                type="checkbox"
              />{" "}
              {opt}
            </li>
          </ul>
        ))}
      </div>
    </div>
  );
};

export default SkinsFilter;
