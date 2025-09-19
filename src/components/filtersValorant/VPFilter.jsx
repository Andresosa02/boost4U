import React, { useState, useEffect } from "react";

const VPFilter = ({ minVP, maxVP, onVPChange, onBack }) => {
  const [minInput, setMinInput] = useState("0");
  const [maxInput, setMaxInput] = useState("12000");

  useEffect(() => {
    setMinInput(minVP.toString());
  }, [minVP]);

  useEffect(() => {
    setMaxInput(maxVP.toString());
  }, [maxVP]);

  const handleMinChange = (e) => {
    const inputValue = e.target.value;
    setMinInput(inputValue);
    if (inputValue === "") {
      onVPChange(0, maxVP);
    } else {
      const value = Number(inputValue);
      if (value <= maxVP && value >= 0) {
        onVPChange(value, maxVP);
      }
    }
  };

  const handleMaxChange = (e) => {
    const inputValue = e.target.value;
    setMaxInput(inputValue);
    if (inputValue === "") {
      onVPChange(minVP, 0);
    } else if (inputValue > 12000) {
      setMaxInput("12000");
      onVPChange(minVP, 12000);
    } else {
      const value = Number(inputValue);
      if (value >= minVP && value <= 12000) {
        onVPChange(minVP, value);
      }
    }
  };

  const handleMinSlider = (e) => {
    const value = Number(e.target.value);
    if (value <= maxVP) {
      onVPChange(value, maxVP);
    }
  };

  const handleMaxSlider = (e) => {
    const value = Number(e.target.value);
    if (value >= minVP) {
      onVPChange(minVP, value);
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
            <h3>Valorant Points</h3>
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
                max={maxVP}
              />
            </div>
            -
            <div className="input-group-skins">
              <input
                type="number"
                placeholder="12000"
                value={maxInput}
                onChange={handleMaxChange}
                min={minVP}
                max="12000"
              />
            </div>
          </div>

          <div className="dual-slider-container">
            <input
              type="range"
              min="0"
              max="12000"
              value={minVP}
              onChange={handleMinSlider}
              className="slider slider-min"
              title={`Mínimo de VP: ${minVP}`}
            />

            <input
              type="range"
              min="0"
              max="12000"
              value={maxVP}
              onChange={handleMaxSlider}
              className="slider slider-max"
              title={`Máximo de VP: ${maxVP}`}
            />
            <div className="price-labels">
              <span>{minVP}</span>
              <span>{maxVP}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VPFilter;
