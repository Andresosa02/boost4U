import React, { useState, useEffect } from "react";

const CardsFilter = ({ minCards, maxCards, onCardsChange, onBack }) => {
  const [minInput, setMinInput] = useState("0");
  const [maxInput, setMaxInput] = useState("800");

  useEffect(() => {
    setMinInput(minCards.toString());
  }, [minCards]);

  useEffect(() => {
    setMaxInput(maxCards.toString());
  }, [maxCards]);

  const handleMinChange = (e) => {
    const inputValue = e.target.value;
    setMinInput(inputValue);
    if (inputValue === "") {
      onCardsChange(0, maxCards);
    } else {
      const value = Number(inputValue);
      if (value <= maxCards && value >= 0) {
        onCardsChange(value, maxCards);
      }
    }
  };

  const handleMaxChange = (e) => {
    const inputValue = e.target.value;
    setMaxInput(inputValue);
    if (inputValue === "") {
      onCardsChange(minCards, 0);
    } else if (inputValue > 800) {
      setMaxInput("800");
      onCardsChange(minCards, 800);
    } else {
      const value = Number(inputValue);
      if (value >= minCards && value <= 800) {
        onCardsChange(minCards, value);
      }
    }
  };

  const handleMinSlider = (e) => {
    const value = Number(e.target.value);
    if (value <= maxCards) {
      onCardsChange(value, maxCards);
    }
  };

  const handleMaxSlider = (e) => {
    const value = Number(e.target.value);
    if (value >= minCards) {
      onCardsChange(minCards, value);
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
            <h3>Cards</h3>
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
                max={maxCards}
              />
            </div>
            -
            <div className="input-group-skins">
              <input
                type="number"
                placeholder="800"
                value={maxInput}
                onChange={handleMaxChange}
                min={minCards}
                max="800"
              />
            </div>
          </div>

          <div className="dual-slider-container">
            <input
              type="range"
              min="0"
              max="800"
              value={minCards}
              onChange={handleMinSlider}
              className="slider slider-min"
              title={`Mínimo de cards: ${minCards}`}
            />

            <input
              type="range"
              min="0"
              max="800"
              value={maxCards}
              onChange={handleMaxSlider}
              className="slider slider-max"
              title={`Máximo de cards: ${maxCards}`}
            />
            <div className="price-labels">
              <span>{minCards}</span>
              <span>{maxCards}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardsFilter;
