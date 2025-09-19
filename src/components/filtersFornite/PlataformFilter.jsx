import React, { useState, useEffect, useRef } from "react";

const OPTIONS = ["PC", "Xbox", "PlayStation", "Android", "iOS", "Switch"];

export default function PlataformFilter({
  selectedPlatforms = [],
  onPlatformChange = () => {},
  isMenuOpen,
  onToggleMenu = () => {},
}) {
  const [selected, setSelected] = useState(selectedPlatforms);
  const [expandedFaq] = useState(true);
  const moreFiltersDropdownRef = useRef(null);

  useEffect(() => setSelected(selectedPlatforms || []), [selectedPlatforms]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isMenuOpen &&
        moreFiltersDropdownRef.current &&
        !moreFiltersDropdownRef.current.contains(event.target)
      ) {
        onToggleMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen, onToggleMenu]);

  const toggle = (opt) => {
    const next = selected.includes(opt)
      ? selected.filter((s) => s !== opt)
      : [...selected, opt];
    setSelected(next);
    onPlatformChange(next);
  };

  return (
    <div className="filter plataform-filter" ref={moreFiltersDropdownRef}>
      <button
        className="dropdown-button-fornite plataforma"
        onClick={() => onToggleMenu(!isMenuOpen)}
      >
        <span> Plataforma</span>
        <img
          src="../../../images/abajo.png"
          className={`faq-arrow-lol ${
            expandedFaq === isMenuOpen ? "expanded-lol" : ""
          }`}
        />
      </button>
      {isMenuOpen && (
        <div className="dropdown-menu">
          {OPTIONS.map((opt) => (
            <ul>
              <li key={opt}>
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
      )}
    </div>
  );
}
