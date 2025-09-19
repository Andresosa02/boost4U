import React from "react";
import { NavbarValorant } from "../components/ui/navbarValorant";

function ValorantPage() {
  return (
    <div className="valorant-page">
      <NavbarValorant />
      <div className="main-content">
        <h1>Valorant Accounts</h1>
        <div className="accounts-grid"></div>
      </div>
    </div>
  );
}

export default ValorantPage;
