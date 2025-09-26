// src/components/AccountCard.jsx
import React from "react";
import { Link } from "react-router-dom";
import "../styles/AccountCard.css"; // Asegúrate de crear este archivo CSS

export const AccountCard = ({ account }) => {
  return (
    <div className="item-ancho">
      <a className="card" href="#">
        <div className="account-card">
          {account.isFeatured && (
            <span className="account-featured">
              <div className="badge-container">⭐</div>
            </span>
          )}
          {account.hasBoost && (
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
                  {account.region} - {account.rank}
                </span>
              </div>
            </div>
            <div className="account-details">
              <p>{account.description}</p>
            </div>

            <div>
              <div className="imagen-card">
                <button className="w-full h-full">
                  <span className="sr-only">Ver imágenes</span>
                  {account.images.map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt={` image`}
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
                <span className="stat-icon">🎮</span>
                <span>{account.champions} Campeones</span>
              </div>
              <div className="stat-item">
                <span className="stat-icon">👕</span>
                <span>{account.skins} Skins</span>
              </div>
              <div className="stat-item">
                <span className="stat-icon">🔝</span>
                <span>Nivel {account.level}</span>
              </div>
              <div className="stat-item">
                <span className="stat-icon">🔮</span>
                <span>{account.be} BE</span>
              </div>
              <div className="stat-item">
                <span className="stat-icon">💎</span>
                <span>{account.rp} RP</span>
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
                    ${account.price.toFixed(2)}
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

export default AccountCard;
