import React, { useState, useEffect } from "react";

const TitlesFilter = ({ minTitles, maxTitles, onTitlesChange, onBack }) => {
  const [minInput, setMinInput] = useState("0");
  const [maxInput, setMaxInput] = useState("320");

  useEffect(() => {
    setMinInput(minTitles.toString());
  }, [minTitles]);

  useEffect(() => {
    setMaxInput(maxTitles.toString());
  }, [maxTitles]);

  const handleMinChange = (e) => {
    const inputValue = e.target.value;
    setMinInput(inputValue);
    if (inputValue === "") {
      onTitlesChange(0, maxTitles);
    } else {
      const value = Number(inputValue);
      if (value <= maxTitles && value >= 0) {
        onTitlesChange(value, maxTitles);
      }
    }
  };

  const handleMaxChange = (e) => {
    const inputValue = e.target.value;
    setMaxInput(inputValue);
    if (inputValue === "") {
      onTitlesChange(minTitles, 0);
    } else if (inputValue > 320) {
      setMaxInput("320");
      onTitlesChange(minTitles, 320);
    } else {
      const value = Number(inputValue);
      if (value >= minTitles && value <= 320) {
        onTitlesChange(minTitles, value);
      }
    }
  };

  const handleMinSlider = (e) => {
    const value = Number(e.target.value);
    if (value <= maxTitles) {
      onTitlesChange(value, maxTitles);
    }
  };

  const handleMaxSlider = (e) => {
    const value = Number(e.target.value);
    if (value >= minTitles) {
      onTitlesChange(minTitles, value);
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
            <h3>Titles</h3>
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
                max={maxTitles}
              />
            </div>
            -
            <div className="input-group-skins">
              <input
                type="number"
                placeholder="320"
                value={maxInput}
                onChange={handleMaxChange}
                min={minTitles}
                max="320"
              />
            </div>
          </div>

          <div className="dual-slider-container">
            <input
              type="range"
              min="0"
              max="320"
              value={minTitles}
              onChange={handleMinSlider}
              className="slider slider-min"
              title={`Mínimo de titles: ${minTitles}`}
            />

            <input
              type="range"
              min="0"
              max="320"
              value={maxTitles}
              onChange={handleMaxSlider}
              className="slider slider-max"
              title={`Máximo de titles: ${maxTitles}`}
            />
            <div className="price-labels">
              <span>{minTitles}</span>
              <span>{maxTitles}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TitlesFilter;
