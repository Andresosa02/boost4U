// src/components/filters/PriceFilter.jsx
import React, { useState, useRef, useEffect } from "react";

const PriceFilter = ({
  minPrice,
  maxPrice,
  onPriceChange,
  isPriceOpen,
  onTogglePrice,
}) => {
  const [minPriceInput, setMinPriceInput] = useState("0");
  const [maxPriceInput, setMaxPriceInput] = useState("7000");
  const [expandedFaq, setExpandedFaq] = useState(null);
  const priceDropdownRef = useRef(null);

  const updateSliderProgress = (minVal, maxVal) => {
    const minPercent = (minVal / 7000) * 100;
    const maxPercent = (maxVal / 7000) * 100;

    const sliderContainer = document.querySelector(".dual-slider-container");
    if (sliderContainer) {
      sliderContainer.style.setProperty("--min-percent", minPercent);
      sliderContainer.style.setProperty("--max-percent", maxPercent);
    }
  };

  useEffect(() => {
    setMinPriceInput(minPrice.toString());
  }, [minPrice]);

  useEffect(() => {
    setMaxPriceInput(maxPrice.toString());
  }, [maxPrice]);

  useEffect(() => {
    updateSliderProgress(minPrice, maxPrice);
  }, [minPrice, maxPrice]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isPriceOpen &&
        priceDropdownRef.current &&
        !priceDropdownRef.current.contains(event.target)
      ) {
        onTogglePrice(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isPriceOpen, onTogglePrice]);

  const handleMinPriceChange = (e) => {
    const inputValue = e.target.value;
    setMinPriceInput(inputValue);

    if (inputValue === "") {
      onPriceChange(0, maxPrice);
    } else {
      const value = Number(inputValue);
      if (value <= maxPrice && value >= 0) {
        onPriceChange(value, maxPrice);
      }
    }
  };

  const handleMaxPriceChange = (e) => {
    const inputValue = e.target.value;
    setMaxPriceInput(inputValue);

    if (inputValue === "") {
      onPriceChange(minPrice, 0);
    } else if (inputValue > 7000) {
      setMaxPriceInput("7000");
      onPriceChange(minPrice, 7000);
    } else {
      const value = Number(inputValue);
      if (value >= minPrice && value <= 7000) {
        onPriceChange(minPrice, value);
      }
    }
  };

  const handleMinSliderChange = (e) => {
    const value = Number(e.target.value);
    if (value <= maxPrice) {
      onPriceChange(value, maxPrice);
    }
  };

  const handleMaxSliderChange = (e) => {
    const value = Number(e.target.value);
    if (value >= minPrice) {
      onPriceChange(minPrice, value);
    }
  };

  const toggleComplete = (menu) => {
    onTogglePrice(!menu);
    setExpandedFaq(true);
  };

  return (
    <div className="dropdown-container-lol" ref={priceDropdownRef}>
      <button
        className="dropdown-button-lol"
        onClick={() => toggleComplete(isPriceOpen)}
      >
        <img src="../../../images/peso.png" />
        <span className="span-price">Price</span>
        <img
          src="../../../images/abajo.png"
          className={`faq-arrow-lol ${
            expandedFaq === isPriceOpen ? "expanded-lol" : ""
          }`}
        />
      </button>
      {isPriceOpen && (
        <div className="dropdown-menu">
          <div className="price-title-container">
            <div className="price-title">
              <h3>Prices</h3>
            </div>
          </div>
          <div className="price-filter-section">
            <div className="price-inputs">
              <div className="input-group">
                <span>$</span>
                <input
                  type="number"
                  placeholder="0"
                  value={minPriceInput}
                  onChange={handleMinPriceChange}
                  min="0"
                  max={maxPrice}
                />
              </div>
              -
              <div className="input-group">
                <span>$</span>
                <input
                  type="number"
                  placeholder="7000"
                  value={maxPriceInput}
                  onChange={handleMaxPriceChange}
                  min={minPrice}
                  max="7000"
                />
              </div>
            </div>

            <div className="dual-slider-container">
              <input
                type="range"
                min="0"
                max="7000"
                value={minPrice}
                onChange={handleMinSliderChange}
                className="slider slider-min"
                title={`Precio mínimo: $${minPrice}`}
              />

              <input
                type="range"
                min="0"
                max="7000"
                value={maxPrice}
                onChange={handleMaxSliderChange}
                className="slider slider-max"
                title={`Precio máximo: $${maxPrice}`}
              />
              <div className="price-labels">
                <span>${minPrice}</span>
                <span>${maxPrice}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PriceFilter;
