import React, { useRef, useEffect, useState } from "react";

const RANGE_OPTS = ["1-50", "50-100", "100-200", "200-500", "500+"];
const VBUCKS_OPTS = ["1-500", "500-1000", "1000-2000", "2000-5000", "5000+"];

function CheckboxList({ label, options, selected = [], onChange }) {
  const toggle = (opt) => {
    const next = selected.includes(opt)
      ? selected.filter((s) => s !== opt)
      : [...selected, opt];
    onChange(next);
  };
  return (
    <div style={{ marginBottom: 8 }}>
      <strong>{label}</strong>
      {options.map((opt) => (
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
  );
}

const MoreFilters = ({
  isMoreFiltersOpen,
  onToggleMoreFilters = () => {},
  selectedPickaxes = [],
  onPickaxesChange = () => {},
  selectedBackBlings = [],
  onBackBlingsChange = () => {},
  selectedEmotes = [],
  onEmotesChange = () => {},
  selectedVBucks = [],
  onVBucksChange = () => {},
  onlyFeatured = false,
  onFeaturedChange = () => {},
}) => {
  const [expandedFaq] = useState(true);
  const moreFiltersDropdownRef = useRef(null);
  // estados para controlar qué filtro individual está abierto
  const [isPickaxesOpen, setIsPickaxesOpen] = useState(false);
  const [isBackBlingsOpen, setIsBackBlingsOpen] = useState(false);
  const [isEmotesOpen, setIsEmotesOpen] = useState(false);
  const [isVBucksOpen, setIsVBucksOpen] = useState(false);
  const [isFeaturedOpen, setIsFeaturedOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isMoreFiltersOpen &&
        moreFiltersDropdownRef.current &&
        !moreFiltersDropdownRef.current.contains(event.target)
      ) {
        onToggleMoreFilters(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMoreFiltersOpen, onToggleMoreFilters]);

  const handleToggleMoreFilters = () => {
    const newState = !isMoreFiltersOpen;
    onToggleMoreFilters(newState);
    // Si abrimos el dropdown, aseguramos que ningún subfiltro quede abierto
    if (newState) {
      setIsPickaxesOpen(false);
      setIsBackBlingsOpen(false);
      setIsEmotesOpen(false);
      setIsVBucksOpen(false);
    }
  };

  return (
    <div
      className="dropdown-container-moreFilterslol"
      ref={moreFiltersDropdownRef}
    >
      <button
        className="dropdown-button-morefilterslol"
        type="button"
        onClick={handleToggleMoreFilters}
      >
        <img src="../../../images/morefilters.png" />
        <span className="span-morefilters"> More Filters </span>
        <img
          src="../../../images/abajo.png"
          className={`faq-arrow-lol ${
            expandedFaq === isMoreFiltersOpen ? "expanded-lol" : ""
          }`}
        />
      </button>

      {isMoreFiltersOpen && (
        <div className="dropdown-menu">
          {/* Si no hay ningún subfiltro abierto, mostrar la lista de filtros */}
          {!isPickaxesOpen &&
            !isBackBlingsOpen &&
            !isEmotesOpen &&
            !isVBucksOpen &&
            !isFeaturedOpen && (
              <ul>
                <li
                  className="lista-mas-filtros"
                  onClick={() => {
                    setIsPickaxesOpen(true);
                    setIsBackBlingsOpen(false);
                    setIsEmotesOpen(false);
                    setIsVBucksOpen(false);
                  }}
                >
                  <span>Pickaxes</span>
                </li>
                <li
                  className="lista-mas-filtros"
                  onClick={() => {
                    setIsBackBlingsOpen(true);
                    setIsPickaxesOpen(false);
                    setIsEmotesOpen(false);
                    setIsVBucksOpen(false);
                  }}
                >
                  <span>BackBlings</span>
                </li>
                <li
                  className="lista-mas-filtros"
                  onClick={() => {
                    setIsEmotesOpen(true);
                    setIsPickaxesOpen(false);
                    setIsBackBlingsOpen(false);
                    setIsVBucksOpen(false);
                  }}
                >
                  <span>Emotes</span>
                </li>
                <li
                  className="lista-mas-filtros"
                  onClick={() => {
                    setIsVBucksOpen(true);
                    setIsPickaxesOpen(false);
                    setIsBackBlingsOpen(false);
                    setIsEmotesOpen(false);
                  }}
                >
                  <span>V-Bucks</span>
                </li>
                <li
                  className="lista-mas-filtros"
                  onClick={() => {
                    setIsFeaturedOpen(true);
                    setIsPickaxesOpen(false);
                    setIsBackBlingsOpen(false);
                    setIsEmotesOpen(false);
                    setIsVBucksOpen(false);
                  }}
                >
                  <span>Featured</span>
                </li>
              </ul>
            )}

          {/* Vista individual de cada filtro con botón 'Back' */}
          {isPickaxesOpen && (
            <div>
              <button
                type="button"
                onClick={() => setIsPickaxesOpen(false)}
                style={{ marginBottom: 8 }}
              >
                ← Back
              </button>
              <CheckboxList
                label="Pickaxes"
                options={RANGE_OPTS}
                selected={selectedPickaxes}
                onChange={onPickaxesChange}
              />
            </div>
          )}

          {isBackBlingsOpen && (
            <div>
              <button
                type="button"
                onClick={() => setIsBackBlingsOpen(false)}
                style={{ marginBottom: 8 }}
              >
                ← Back
              </button>
              <CheckboxList
                label="BackBlings"
                options={RANGE_OPTS}
                selected={selectedBackBlings}
                onChange={onBackBlingsChange}
              />
            </div>
          )}

          {isEmotesOpen && (
            <div>
              <button
                type="button"
                onClick={() => setIsEmotesOpen(false)}
                style={{ marginBottom: 8 }}
              >
                ← Back
              </button>
              <CheckboxList
                label="Emotes"
                options={RANGE_OPTS}
                selected={selectedEmotes}
                onChange={onEmotesChange}
              />
            </div>
          )}

          {isVBucksOpen && (
            <div>
              <button
                type="button"
                onClick={() => setIsVBucksOpen(false)}
                style={{ marginBottom: 8 }}
              >
                ← Back
              </button>
              <CheckboxList
                label="V-Bucks"
                options={VBUCKS_OPTS}
                selected={selectedVBucks}
                onChange={onVBucksChange}
              />
            </div>
          )}

          {isFeaturedOpen && (
            <div>
              <button
                type="button"
                onClick={() => setIsFeaturedOpen(false)}
                style={{ marginBottom: 8 }}
              >
                ← Back
              </button>
              <div style={{ marginTop: 8 }}>
                <label>
                  <input
                    type="checkbox"
                    checked={onlyFeatured}
                    onChange={(e) => onFeaturedChange(e.target.checked)}
                  />{" "}
                  Solo featured
                </label>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MoreFilters;
