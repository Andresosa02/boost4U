import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import supabase from "../../supabaseClient";
import AuthProtectedLink from "../../components/AuthProtectedLink";
import "./VendiendoCuentaslol.css";

const VendiendoCuentasFornite = () => {
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
          .from("accountFornite") // Tu tabla
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
          {accountData.instantDeli && (
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
              Description
              <div className="seller-info">{accountData.descriptionData}</div>
            </div>
          </div>

          {/* Tabla de Estadísticas */}
          <div className="stats-section">
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-label">Plataform</div>
                <div className="stat-value">{accountData.entorno}</div>
              </div>
              <div className="stat-item">
                <div className="stat-label">Account Type</div>
                <div className="stat-value">{accountData.accountType}</div>
              </div>
              <div className="stat-item">
                <div className="stat-label">Outfits/Skins</div>
                <div className="stat-value">{accountData.skins}</div>
              </div>
              <div className="stat-item">
                <div className="stat-label">V-Bucks</div>
                <div className="stat-value">{accountData.V_Bucks} </div>
              </div>
              <div className="stat-item">
                <div className="stat-label">Account Level</div>
                <div className="stat-value">{accountData.level}</div>
              </div>
              <div className="stat-item">
                <div className="stat-label">Pickaxes</div>
                <div className="stat-value">{accountData.pickaxes}</div>
              </div>
              <div className="stat-item">
                <div className="stat-label">Emotes</div>
                <div className="stat-value">{accountData.emotes}</div>
              </div>
              <div className="stat-item">
                <div className="stat-label">BackBlings/Backpacks</div>
                <div className="stat-value">{accountData.backBlings}</div>
              </div>
              <div className="stat-item">
                <div className="stat-label">Gliders</div>
                <div className="stat-value">{accountData.skins}</div>
              </div>
              <div className="stat-item">
                <div className="stat-label">Wraps</div>
                <div className="stat-value">{accountData.wraps}</div>
              </div>
              <div className="stat-item">
                <div className="stat-label">Sprays</div>
                <div className="stat-value">{accountData.sprays}</div>
              </div>
              <div className="stat-item">
                <div className="stat-label">Loadings/Banners</div>
                <div className="stat-value">{accountData.loadings}</div>
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

export default VendiendoCuentasFornite;
