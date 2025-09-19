// src/components/AccountCard.jsx
import React from "react";
import { Link } from "react-router-dom";
import "../styles/AccountCardFornite.css";

export const AccountCardFornite = ({ accountFornite }) => {
  function imgEntorno(entorno) {
    switch (entorno) {
      case "PC":
        return "🖥️";
      case "Xbox":
        return "🎮";
      case "PlayStation":
        return "🎮";
      case "Android":
        return "🎮";
      case "iOS":
        return "🎮";
      case "Switch":
        return "🎮";
      default:
        return "🌐";
    }
  }
  return (
    <div className="item-ancho">
      <a className="card" href="#">
        <div className="account-card">
          {accountFornite.isFeatured && (
            <span className="account-featured">
              <div className="badge-container">⭐</div>
            </span>
          )}
          {accountFornite.instantDeli && (
            <span className="account-boost">
              <div className="badge-container">
                <i className="fa-solid fa-bolt">⚡</i>
              </div>
            </span>
          )}
          <div className="header-contenedor">
            <div className="account-header">
              <div className="content-region">
                <span className="account-region">
                  {imgEntorno(accountFornite.entorno)} {accountFornite.entorno}{" "}
                  - {accountFornite.skins + " skins"}
                </span>
              </div>
            </div>
            <div className="account-details">
              <p>{accountFornite.description}</p>
            </div>

            <div>
              <div className="imagen-card">
                <button className="w-full h-full">
                  <span className="sr-only">Ver imágenes</span>
                  {accountFornite.images.map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt={`image ${index}`}
                      className="object-cover w-full h-full"
                    />
                  ))}
                </button>
                <button className="button-component">
                  <i className="mr-2 fas fa-images"></i>
                </button>
              </div>
            </div>
            <div className="account-stats">
              <div className="stat-item">
                <span className="stat-icon">👕</span>
                <span>{accountFornite.skins} Skins</span>
              </div>
              <div className="stat-item">
                <span className="stat-icon">🎮</span>
                <span>{accountFornite.V_Bucks} V-Bucks</span>
              </div>
              <div className="stat-item">
                <span className="stat-icon">🔝</span>
                <span>{accountFornite.emotes} Emotes </span>
              </div>
              <div className="stat-item">
                <span className="stat-icon">🔮</span>
                <span>{accountFornite.pickaxes} Pickaxes</span>
              </div>
              <div className="stat-item">
                <span className="stat-icon">💎</span>
                <span>{accountFornite.backBlings} BackBling/Backpacks</span>
              </div>
              <div className="stat-item">
                <span className="stat-icon">🎮</span>
                <span>{accountFornite.gliders} Gliders</span>
              </div>
              <div className="stat-item">
                <span className="stat-icon">🎮</span>
                <span>{accountFornite.wraps} Wraps </span>
              </div>
              <div className="stat-item">
                <span className="stat-icon">🎮</span>
                <span>{accountFornite.loadings} Loadings/Banners </span>
              </div>
              <div className="stat-item">
                <span className="stat-icon">🎮</span>
                <span>{accountFornite.sprays} Sprays</span>
              </div>
              <div className="stat-item">
                <span className="stat-icon">🎮</span>
                <span> Account Level {accountFornite.level}</span>
              </div>
            </div>
            <div
              data-orientation="horizontal"
              role="separator"
              className="divider-line"
            ></div>
            <div className="footer-contenedores">
              <div className="account-footer">
                <div className="contenedores-precio">
                  <span className="account-price">
                    ${accountFornite.price.toFixed(2)}
                  </span>
                  <span className="divisa">USD</span>
                </div>
                <button className="buy-button">
                  <span className="truncate">Comprar Ahora →</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </a>
    </div>
  );
};
