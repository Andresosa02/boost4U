import React from "react";
import { NavbarFornite } from "../components/ui/navbarFornite";
import { AccountCardFornite } from "../components/AccountCardFornite";

function FortnitePage() {
  return (
    <div className="fornite-page">
      <NavbarFornite />
      <div className="main-content">
        <h1>Fornite Accounts</h1>
        <div className="accounts-grid">
          {/* Aquí se mapearían las cuentas de Fornite */}
        </div>
      </div>
    </div>
  );
}

export default FortnitePage;
