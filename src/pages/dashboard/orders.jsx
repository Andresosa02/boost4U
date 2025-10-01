import React from "react";
import NavbarUsers from "../../components/ui/navbarUsers";
import "./style/Dashboard.css";

export const Orders = () => {
  return (
    <div>
      <NavbarUsers />
      <div className="dashboard-contenedor">
        <h2>Dashboard</h2>
        <div className="dashboard-cards-grid">
          <div className="dashboard-card dashboard-placeholder">
            <h3>Pedido en proceso</h3>
            <p>Detalles de la cuenta y progreso aparecerán aquí.</p>
          </div>
          <div className="dashboard-card dashboard-placeholder">
            <h3>Pedido completado</h3>
            <p>Historial de compras se listará aquí.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;
