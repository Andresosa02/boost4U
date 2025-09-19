// src/components/filters/SkinsFilter.jsx
import React, { useState, useEffect } from "react";

const SkinsFilter = ({ minSkins, maxSkins, onSkinsChange, onBack }) => {
  const [minSkinsInput, setMinSkinsInput] = useState("0");
  const [maxSkinsInput, setMaxSkinsInput] = useState("1900");

  const updateSliderSkinsProgress = (minVal, maxVal) => {
    const minPercentSkins = (minVal / 1900) * 100;
    const maxPercentSkins = (maxVal / 1900) * 100;

    const sliderContainer = document.querySelector(".dual-slider-container");
    if (sliderContainer) {
      sliderContainer.style.setProperty("--min-percent", minPercentSkins);
      sliderContainer.style.setProperty("--max-percent", maxPercentSkins);
    }
  };

  useEffect(() => {
    setMinSkinsInput(minSkins.toString());
  }, [minSkins]);

  useEffect(() => {
    setMaxSkinsInput(maxSkins.toString());
  }, [maxSkins]);

  useEffect(() => {
    updateSliderSkinsProgress(minSkins, maxSkins);
  }, [minSkins, maxSkins]);

  const handleMinSkinsChange = (e) => {
    const inputValue = e.target.value;
    setMinSkinsInput(inputValue);

    if (inputValue === "") {
      onSkinsChange(0, maxSkins);
    } else {
      const value = Number(inputValue);
      if (value <= maxSkins && value >= 0) {
        onSkinsChange(value, maxSkins);
      }
    }
  };

  const handleMaxSkinsChange = (e) => {
    const inputValue = e.target.value;
    setMaxSkinsInput(inputValue);

    if (inputValue === "") {
      onSkinsChange(minSkins, 0);
    } else if (inputValue > 1900) {
      setMaxSkinsInput("1900");
      onSkinsChange(minSkins, 1900);
    } else {
      const value = Number(inputValue);
      if (value >= minSkins && value <= 1900) {
        onSkinsChange(minSkins, value);
      }
    }
  };

  const handleMinSliderSkinsChange = (e) => {
    const value = Number(e.target.value);
    if (value <= maxSkins) {
      onSkinsChange(value, maxSkins);
    }
  };

  const handleMaxSliderSkinsChange = (e) => {
    const value = Number(e.target.value);
    if (value >= minSkins) {
      onSkinsChange(minSkins, value);
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
            <h3>Skins</h3>
          </div>
        </div>
        <div className="skins-filter-section">
          <div className="skins-inputs">
            <div className="input-group-skins">
              <input
                type="number"
                placeholder="0"
                value={minSkinsInput}
                onChange={handleMinSkinsChange}
                min="0"
                max={maxSkins}
              />
            </div>
            -
            <div className="input-group-skins">
              <input
                type="number"
                placeholder="1900"
                value={maxSkinsInput}
                onChange={handleMaxSkinsChange}
                min={minSkins}
                max="1900"
              />
            </div>
          </div>

          <div className="dual-slider-container">
            <input
              type="range"
              min="0"
              max="1900"
              value={minSkins}
              onChange={handleMinSliderSkinsChange}
              className="slider slider-min"
              title={`Mínimo de skins: ${minSkins}`}
            />

            <input
              type="range"
              min="0"
              max="1900"
              value={maxSkins}
              onChange={handleMaxSliderSkinsChange}
              className="slider slider-max"
              title={`Máximo de skins: ${maxSkins}`}
            />
            <div className="price-labels">
              <span>{minSkins}</span>
              <span>{maxSkins}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkinsFilter;
