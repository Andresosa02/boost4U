import React from "react";

const FeaturedFilter = ({ isFeaturedOnly, onFeaturedChange, onBack }) => {
  const handleToggle = (e) => {
    onFeaturedChange(e.target.checked);
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
            <h3>Featured</h3>
          </div>
        </div>
        <div className="skins-filter-section featured-switch">
          <label className="featured-switch-label">
            <input
              type="checkbox"
              checked={!!isFeaturedOnly}
              onChange={handleToggle}
            />
            <span>Show only featured accounts</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default FeaturedFilter;
