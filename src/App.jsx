// src/App.jsx

import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Index from "./pages/index.jsx";
import LolPage from "./pages/lolpage.jsx";
import BoostingLol from "./pages/boostinglol.jsx";
import AccountsPagelol from "./pages/accountslol.jsx";
import AccountsPageFortnite from "./pages/accountsFortnite.jsx";
import AccountsPageValorant from "./pages/accountsValorant.jsx";
import FortnitePage from "./pages/fortnitepage.jsx";
import ValorantPage from "./pages/valorantpage.jsx";
import { Header } from "./components/Header.jsx";
import Settings from "./pages/dashboard/settings.jsx";
import Orders from "./pages/dashboard/orders.jsx";
import Library from "./pages/dashboard/library.jsx";
import Admin from "./pages/dashboard/admin.jsx";
import Sales from "./pages/dashboard/sales.jsx";
import VendiendoCuentaslol from "./pages/Ventas/vendiendoCuentaslol.jsx";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Header />

      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/boost4U/" element={<Index />} />
        <Route path="/cuentaslol" element={<AccountsPagelol />} />
        <Route path="/boosting" element={<BoostingLol />} />
        <Route path="/accountsFortnite" element={<AccountsPageFortnite />} />
        <Route path="/lol" element={<LolPage />} />
        <Route path="/fortnite" element={<FortnitePage />} />
        <Route path="/valorant" element={<ValorantPage />} />
        <Route path="/cuentasValorant" element={<AccountsPageValorant />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/library" element={<Library />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/sales" element={<Sales />} />
        <Route
          path="/vendiendoCuentaslol/:id"
          element={<VendiendoCuentaslol />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
