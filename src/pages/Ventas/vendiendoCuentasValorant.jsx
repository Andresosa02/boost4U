import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import supabase from "../../supabaseClient";
import AuthProtectedLink from "../../components/AuthProtectedLink";
import "./VendiendoCuentaslol.css";

const VendiendoCuentasValorant = () => {
  const [activeTab, setActiveTab] = useState("champions");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { id } = useParams();
  const [accountData, setAccountData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 2. Función para obtener los datos de la cuenta específica
    const fetchAccount = async () => {
      if (!id) return; // Salir si por alguna razón no hay ID

      try {
        const { data, error } = await supabase
          .from("account") // Tu tabla
          .select("*") // Selecciona todas las columnas
          .eq("id", id) // 🚨 FILTRA por el ID
          .single(); // Espera un único resultado

        if (error && error.code !== "PGRST116") {
          // PGRST116 es "no rows found"
          setError(error.message);
          setAccountData(null);
        } else if (data) {
          setAccountData(data);
        } else {
          setError("Cuenta no encontrada.", error.message);
        }
      } catch (error) {
        setError("Error al conectar con Supabase.", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAccount();
  }, [id]);

  if (loading) return <div>Cargando detalles de la cuenta...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!accountData) return <div>No se encontró la cuenta.</div>;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % accountData.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) =>
        (prev - 1 + accountData.images.length) % accountData.images.length
    );
  };

  return (
    <div className="vendiendo-cuentas-container">
      {/* Banner Superior */}
      <div className="account-banner">
        <div className="banner-info">{accountData.description}</div>
        <div className="banner-badges">
          <span className="badge cashback">
            {accountData.cashback} Cashback
          </span>
          {accountData.instantDelivery && (
            <span className="badge instant">⚡ Instant Account Delivery</span>
          )}
          {accountData.isFeatured && (
            <span className="badge warranty">⭐ Featured Account</span>
          )}
        </div>
      </div>

      <div className="main-layout">
        {/* Columna Izquierda - Contenido Principal */}
        <div className="left-column">
          {/* Sección Account Data */}
          <div className="account-data-section">
            <h2 className="section-title">Account Data</h2>
            <div className="description-section">
              <div className="seller-info">{accountData.descriptionData}</div>
            </div>
          </div>

          {/* Tabla de Estadísticas */}
          <div className="stats-section">
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-label">Rank</div>
                <div className="stat-value">{accountData.rank}</div>
              </div>
              <div className="stat-item">
                <div className="stat-label">Flex Rank</div>
                <div className="stat-value">{accountData.flexRank}</div>
              </div>
              <div className="stat-item">
                <div className="stat-label">Server</div>
                <div className="stat-value">{accountData.region}</div>
              </div>
              <div className="stat-item">
                <div className="stat-label">Level</div>
                <div className="stat-value">{accountData.level} </div>
              </div>
              <div className="stat-item">
                <div className="stat-label">Ranked Ready</div>
                <div className="stat-value">
                  {accountData.rankedReady ? "✅ Yes" : "❌ No"}
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-label">Blue Essence</div>
                <div className="stat-value">{accountData.be}</div>
              </div>
              <div className="stat-item">
                <div className="stat-label">Riot Points</div>
                <div className="stat-value">{accountData.rp}</div>
              </div>
              <div className="stat-item">
                <div className="stat-label">Champions</div>
                <div className="stat-value">{accountData.champions}</div>
              </div>
              <div className="stat-item">
                <div className="stat-label">Skins</div>
                <div className="stat-value">{accountData.skins}</div>
              </div>
            </div>
          </div>

          {/* Filtros Champions/Skins/Roles */}
          <div className="filters-section">
            <div className="filter-tabs">
              <button
                className={`filter-tab ${
                  activeTab === "champions" ? "active" : ""
                }`}
                onClick={() => setActiveTab("champions")}
              >
                ⚔️ Champions {accountData.champions}
              </button>
              <button
                className={`filter-tab ${
                  activeTab === "skins" ? "active" : ""
                }`}
                onClick={() => setActiveTab("skins")}
              >
                👕 Skins {accountData.skins}
              </button>
              <button
                className={`filter-tab ${
                  activeTab === "roles" ? "active" : ""
                }`}
                onClick={() => setActiveTab("roles")}
              >
                ⚙️ Roles {accountData.roles.length}
              </button>
            </div>
            <div className="filter-content">
              <div className="empty-state">
                <div className="empty-icon">🪖</div>
                <div className="empty-title">Empty Champions</div>
                <div className="empty-description">
                  We couldn't find any Champions
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Columna Derecha - Sidebar */}
        <div className="right-column">
          {/* Fast Checkout */}
          <div className="checkout-section">
            <div className="checkout-header">
              <h3>⚡ Fast Checkout</h3>
              <button className="bookmark-btn">🔖</button>
            </div>
            <p className="checkout-description">
              You'll get the account logins instantly after the payment.
            </p>
            <div className="checkout-features">
              <div className="checkout-feature">
                ● Email and password can be changed
              </div>
              <div className="checkout-feature">
                ● Instant delivery after payment
              </div>
              <div className="checkout-feature">
                ● Free warranty and support
              </div>
            </div>
            <div className="price-section">
              <div className="price-display">
                <span className="price">${accountData.price}</span>
                <span className="currency">{accountData.currency}</span>
                <span className="cashback-badge">
                  Cashback {accountData.cashback}
                </span>
              </div>
            </div>
            <div className="checkout-buttons">
              <AuthProtectedLink
                to={`/checkout/${accountData.id}`}
                className="text-decoration-none"
              >
                <button className="buy-button">Buy Account →</button>
              </AuthProtectedLink>
            </div>
          </div>

          {/* Trustpilot Rating */}

          {/* Gallery */}
          <div className="gallery-section">
            <div className="gallery-header">
              <h3>Gallery {accountData.images.length}</h3>
              <div className="gallery-nav">
                <button onClick={prevImage} className="nav-btn">
                  ‹
                </button>
                <button onClick={nextImage} className="nav-btn">
                  ›
                </button>
              </div>
            </div>
            <div className="gallery-grid">
              {accountData.images.map((image, index) => (
                <div key={index} className="gallery-item">
                  <img src={image} alt={`Gallery ${index + 1}`} />
                </div>
              ))}
            </div>
            <div className="gallery-counter">
              {currentImageIndex + 1}/{accountData.images.length}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendiendoCuentasValorant;
