import React, { useState, useEffect } from "react";

const SpraysFilter = ({ minSprays, maxSprays, onSpraysChange, onBack }) => {
  const [minInput, setMinInput] = useState("0");
  const [maxInput, setMaxInput] = useState("780");

  useEffect(() => {
    setMinInput(minSprays.toString());
  }, [minSprays]);

  useEffect(() => {
    setMaxInput(maxSprays.toString());
  }, [maxSprays]);

  const handleMinChange = (e) => {
    const inputValue = e.target.value;
    setMinInput(inputValue);
    if (inputValue === "") {
      onSpraysChange(0, maxSprays);
    } else {
      const value = Number(inputValue);
      if (value <= maxSprays && value >= 0) {
        onSpraysChange(value, maxSprays);
      }
    }
  };

  const handleMaxChange = (e) => {
    const inputValue = e.target.value;
    setMaxInput(inputValue);
    if (inputValue === "") {
      onSpraysChange(minSprays, 0);
    } else if (inputValue > 780) {
      setMaxInput("780");
      onSpraysChange(minSprays, 780);
    } else {
      const value = Number(inputValue);
      if (value >= minSprays && value <= 780) {
        onSpraysChange(minSprays, value);
      }
    }
  };

  const handleMinSlider = (e) => {
    const value = Number(e.target.value);
    if (value <= maxSprays) {
      onSpraysChange(value, maxSprays);
    }
  };

  const handleMaxSlider = (e) => {
    const value = Number(e.target.value);
    if (value >= minSprays) {
      onSpraysChange(minSprays, value);
    }
  };

  return (
    <div>
      <div className="back-button-container">
        <button className="back-button" onClick={onBack}>
          ← Volver a Filtros
        </button>
      </div>

      <div className="dropdown-menu-skins">
        <div className="skins-title-container">
          <div className="skins-title">
            <h3>Sprays</h3>
          </div>
        </div>
        <div className="skins-filter-section">
          <div className="skins-inputs">
            <div className="input-group-skins">
              <input
                type="number"
                placeholder="0"
                value={minInput}
                onChange={handleMinChange}
                min="0"
                max={maxSprays}
              />
            </div>
            -
            <div className="input-group-skins">
              <input
                type="number"
                placeholder="780"
                value={maxInput}
                onChange={handleMaxChange}
                min={minSprays}
                max="780"
              />
            </div>
          </div>

          <div className="dual-slider-container">
            <input
              type="range"
              min="0"
              max="780"
              value={minSprays}
              onChange={handleMinSlider}
              className="slider slider-min"
              title={`Mínimo de sprays: ${minSprays}`}
            />

            <input
              type="range"
              min="0"
              max="780"
              value={maxSprays}
              onChange={handleMaxSlider}
              className="slider slider-max"
              title={`Máximo de sprays: ${maxSprays}`}
            />
            <div className="price-labels">
              <span>{minSprays}</span>
              <span>{maxSprays}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpraysFilter;
