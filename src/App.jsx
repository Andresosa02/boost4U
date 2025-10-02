// src/App.jsx

import React from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
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
import VendiendoCuentasValorant from "./pages/Ventas/vendiendoCuentasValorant.jsx";
import VendiendoCuentasFornite from "./pages/Ventas/vendiendoCuentasFornite.jsx";
import Checkout from "./pages/checkout/checkout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

import "./App.css";

function AppInner() {
  const location = useLocation();
  const hideHeader = location.pathname.startsWith("/checkout");

  return (
    <>
      {!hideHeader && <Header />}

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
        <Route
          path="/vendiendoCuentasValorant/:id"
          element={<VendiendoCuentasValorant />}
        />
        <Route
          path="/vendiendoCuentasFortnite/:id"
          element={<VendiendoCuentasFornite />}
        />
        <Route
          path="/checkout/:id"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppInner />
    </BrowserRouter>
  );
}

export default App;
