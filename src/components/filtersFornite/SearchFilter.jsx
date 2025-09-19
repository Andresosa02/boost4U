// src/components/filters/SearchFilter.jsx
import React from "react";

const SearchFilter = ({ search, onSearchChange }) => {
  return (
    <div className="search-box">
      <input
        className="input-buscador"
        type="text"
        placeholder="Buscar cuentas..."
        value={search}
        onChange={onSearchChange}
      />
    </div>
  );
};

export default SearchFilter;
