import React from "react";
import NavbarUsers from "../../components/ui/navbarUsers";
import "../../styles/Dashboard.css";

export const Library = () => {
  return (
    <div>
      <NavbarUsers />
      <div className="contenedor">
        <h2>Library</h2>
        <p>Las cuentas guardadas aparecerán aquí.</p>
        <div className="cards-grid">
          <div className="card placeholder">
            <h3>Cuenta guardada 1</h3>
            <p>Resumen de la cuenta.</p>
          </div>
          <div className="card placeholder">
            <h3>Cuenta guardada 2</h3>
            <p>Resumen de la cuenta.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Library;
