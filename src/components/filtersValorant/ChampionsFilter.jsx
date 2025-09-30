import React, { useState, useEffect } from "react";

const ChampionsFilter = ({
  minChampion,
  maxChampion,
  onChampionChange,
  onBack,
}) => {
  const [minChampionInput, setMinChampionInput] = useState("0");
  const [maxChampionInput, setMaxChampionInput] = useState("27");

  const updateSliderChampionsProgress = (minVal, maxVal) => {
    const minPercentChampions = (minVal / 27) * 100;
    const maxPercentChampions = (maxVal / 27) * 100;

    const sliderContainer = document.querySelector(".dual-slider-container");
    if (sliderContainer) {
      sliderContainer.style.setProperty("--min-percent", minPercentChampions);
      sliderContainer.style.setProperty("--max-percent", maxPercentChampions);
    }
  };

  useEffect(() => {
    setMinChampionInput(minChampion.toString());
  }, [minChampion]);

  useEffect(() => {
    setMaxChampionInput(maxChampion.toString());
  }, [maxChampion]);

  useEffect(() => {
    updateSliderChampionsProgress(minChampion, maxChampion);
  }, [minChampion, maxChampion]);

  const handleMinChampionChange = (e) => {
    const inputValue = e.target.value;
    setMinChampionInput(inputValue);

    if (inputValue === "") {
      onChampionChange(0, maxChampion);
    } else {
      const value = Number(inputValue);
      if (value <= maxChampion && value >= 0) {
        onChampionChange(value, maxChampion);
      }
    }
  };

  const handleMaxChampionChange = (e) => {
    const inputValue = e.target.value;
    setMaxChampionInput(inputValue);

    if (inputValue === "") {
      onChampionChange(minChampion, 0);
    } else if (inputValue > 27) {
      setMaxChampionInput("27");
      onChampionChange(minChampion, 27);
    } else {
      const value = Number(inputValue);
      if (value >= minChampion && value <= 27) {
        onChampionChange(minChampion, value);
      }
    }
  };

  const handleMinSliderChampionsChange = (e) => {
    const value = Number(e.target.value);
    if (value <= maxChampion) {
      onChampionChange(value, maxChampion);
    }
  };

  const handleMaxSliderChampionsChange = (e) => {
    const value = Number(e.target.value);
    if (value >= minChampion) {
      onChampionChange(minChampion, value);
    }
  };

  return (
    <div>
      <div className="back-button-container">
        <button className="back-button" onClick={onBack}>
          ← Volver a Filtros
        </button>
      </div>

      <div className="dropdown-menu-champions">
        <div className="champions-title-container">
          <div className="champions-title">
            <h3>Agents</h3>
          </div>
        </div>
        <div className="champions-filter-section">
          <div className="champions-inputs">
            <div className="input-group-champions">
              <input
                type="number"
                placeholder="0"
                value={minChampionInput}
                onChange={handleMinChampionChange}
                min="0"
                max={maxChampion}
              />
            </div>
            -
            <div className="input-group-champions">
              <input
                type="number"
                placeholder="27"
                value={maxChampionInput}
                onChange={handleMaxChampionChange}
                min={minChampion}
                max="27"
              />
            </div>
          </div>

          <div className="dual-slider-container">
            <input
              type="range"
              min="0"
              max="27"
              value={minChampion}
              onChange={handleMinSliderChampionsChange}
              className="slider slider-min"
              title={`Champions mínimos: ${minChampion}`}
            />

            <input
              type="range"
              min="0"
              max="27"
              value={maxChampion}
              onChange={handleMaxSliderChampionsChange}
              className="slider slider-max"
              title={`Champions máximos: ${maxChampion}`}
            />
            <div className="price-labels">
              <span>{minChampion}</span>
              <span>{maxChampion}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChampionsFilter;
