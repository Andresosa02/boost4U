import React, { useState, useEffect } from "react";

const BuddiesFilter = ({ minBuddies, maxBuddies, onBuddiesChange, onBack }) => {
  const [minInput, setMinInput] = useState("0");
  const [maxInput, setMaxInput] = useState("1214");

  useEffect(() => {
    setMinInput(minBuddies.toString());
  }, [minBuddies]);

  useEffect(() => {
    setMaxInput(maxBuddies.toString());
  }, [maxBuddies]);

  const handleMinChange = (e) => {
    const inputValue = e.target.value;
    setMinInput(inputValue);
    if (inputValue === "") {
      onBuddiesChange(0, maxBuddies);
    } else {
      const value = Number(inputValue);
      if (value <= maxBuddies && value >= 0) {
        onBuddiesChange(value, maxBuddies);
      }
    }
  };

  const handleMaxChange = (e) => {
    const inputValue = e.target.value;
    setMaxInput(inputValue);
    if (inputValue === "") {
      onBuddiesChange(minBuddies, 0);
    } else if (inputValue > 1214) {
      setMaxInput("1214");
      onBuddiesChange(minBuddies, 1214);
    } else {
      const value = Number(inputValue);
      if (value >= minBuddies && value <= 1214) {
        onBuddiesChange(minBuddies, value);
      }
    }
  };

  const handleMinSlider = (e) => {
    const value = Number(e.target.value);
    if (value <= maxBuddies) {
      onBuddiesChange(value, maxBuddies);
    }
  };

  const handleMaxSlider = (e) => {
    const value = Number(e.target.value);
    if (value >= minBuddies) {
      onBuddiesChange(minBuddies, value);
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
            <h3>Buddies</h3>
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
                max={maxBuddies}
              />
            </div>
            -
            <div className="input-group-skins">
              <input
                type="number"
                placeholder="1214"
                value={maxInput}
                onChange={handleMaxChange}
                min={minBuddies}
                max="1214"
              />
            </div>
          </div>

          <div className="dual-slider-container">
            <input
              type="range"
              min="0"
              max="1214"
              value={minBuddies}
              onChange={handleMinSlider}
              className="slider slider-min"
              title={`Mínimo de buddies: ${minBuddies}`}
            />

            <input
              type="range"
              min="0"
              max="1214"
              value={maxBuddies}
              onChange={handleMaxSlider}
              className="slider slider-max"
              title={`Máximo de buddies: ${maxBuddies}`}
            />
            <div className="price-labels">
              <span>{minBuddies}</span>
              <span>{maxBuddies}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuddiesFilter;
