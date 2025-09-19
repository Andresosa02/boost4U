// src/components/filters/RankWinrateFilter.jsx
import React, { useState, useEffect } from "react";

const RankWinrateFilter = ({
  minRankWinrate,
  maxRankWinrate,
  onRankWinrateChange,
  onBack,
}) => {
  const [minSkinsInput, setMinSkinsInput] = useState("0");
  const [maxSkinsInput, setMaxSkinsInput] = useState("100");

  const updateSliderSkinsProgress = (minVal, maxVal) => {
    const minPercentSkins = (minVal / 100) * 100;
    const maxPercentSkins = (maxVal / 100) * 100;

    const sliderContainer = document.querySelector(".dual-slider-container");
    if (sliderContainer) {
      sliderContainer.style.setProperty("--min-percent", minPercentSkins);
      sliderContainer.style.setProperty("--max-percent", maxPercentSkins);
    }
  };

  useEffect(() => {
    setMinSkinsInput(minRankWinrate.toString());
  }, [minRankWinrate]);

  useEffect(() => {
    setMaxSkinsInput(maxRankWinrate.toString());
  }, [maxRankWinrate]);

  useEffect(() => {
    updateSliderSkinsProgress(minRankWinrate, maxRankWinrate);
  }, [minRankWinrate, maxRankWinrate]);

  const handleMinSkinsChange = (e) => {
    const inputValue = e.target.value;
    setMinSkinsInput(inputValue);

    if (inputValue === "") {
      onRankWinrateChange(0, maxRankWinrate);
    } else {
      const value = Number(inputValue);
      if (value <= maxRankWinrate && value >= 0) {
        onRankWinrateChange(value, maxRankWinrate);
      }
    }
  };

  const handleMaxSkinsChange = (e) => {
    const inputValue = e.target.value;
    setMaxSkinsInput(inputValue);

    if (inputValue === "") {
      onRankWinrateChange(minRankWinrate, 0);
    } else if (inputValue > 100) {
      setMaxSkinsInput("100");
      onRankWinrateChange(minRankWinrate, 100);
    } else {
      const value = Number(inputValue);
      if (value >= minRankWinrate && value <= 100) {
        onRankWinrateChange(minRankWinrate, value);
      }
    }
  };

  const handleMinSliderSkinsChange = (e) => {
    const value = Number(e.target.value);
    if (value <= maxRankWinrate) {
      onRankWinrateChange(value, maxRankWinrate);
    }
  };

  const handleMaxSliderSkinsChange = (e) => {
    const value = Number(e.target.value);
    if (value >= minRankWinrate) {
      onRankWinrateChange(minRankWinrate, value);
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
            <h3>Rank Winrate</h3>
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
                max={maxRankWinrate}
              />
            </div>
            -
            <div className="input-group-skins">
              <input
                type="number"
                placeholder="100"
                value={maxSkinsInput}
                onChange={handleMaxSkinsChange}
                min={minRankWinrate}
                max="100"
              />
            </div>
          </div>

          <div className="dual-slider-container">
            <input
              type="range"
              min="0"
              max="100"
              value={minRankWinrate}
              onChange={handleMinSliderSkinsChange}
              className="slider slider-min"
              title={`Mínimo de skins: ${minRankWinrate}`}
            />

            <input
              type="range"
              min="0"
              max="100"
              value={maxRankWinrate}
              onChange={handleMaxSliderSkinsChange}
              className="slider slider-max"
              title={`Máximo de skins: ${maxRankWinrate}`}
            />
            <div className="price-labels">
              <span>{minRankWinrate}</span>
              <span>{maxRankWinrate}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RankWinrateFilter;
