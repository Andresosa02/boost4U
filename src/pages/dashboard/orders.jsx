import React from "react";
import NavbarUsers from "../../components/ui/navbarUsers";
import "../../styles/Dashboard.css";

export const Orders = () => {
  return (
    <div>
      <NavbarUsers />
      <div className="contenedor">
        <h2>Dashboard</h2>
        <div className="cards-grid">
          <div className="card placeholder">
            <h3>Pedido en proceso</h3>
            <p>Detalles de la cuenta y progreso aparecerán aquí.</p>
          </div>
          <div className="card placeholder">
            <h3>Pedido completado</h3>
            <p>Historial de compras se listará aquí.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;
