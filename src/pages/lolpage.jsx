import React, { useState, useEffect } from "react";
import { Navbarlol } from "../components/ui/navbarlol";
import { AccountCard } from "../components/AccountCard";
import supabase from "../supabaseClient";
import "../styles/LolPage.css";

function LolPage() {
  const services = [
    {
      id: 1,
      title: "Rank Boost",
      description:
        "Un jugador de Challenger te hará Boost hasta el rango que desees.",
      icon: "⭐",
      color: "blue",
      url: "/boostinglolPay",
    },
    {
      id: 2,
      title: "Ganar Boost",
      description: "El mejor para ganar fuera una realidad... ¿o lo es?",
      icon: "🏆",
      color: "gold",
      url: "/boostinglolPay",
    },
    {
      id: 3,
      title: "Paquetes de Boost",
      description: "Ahorra hasta 30% con nuestros paquetes de boost de LoL",
      icon: "📦",
      color: "multi",
      url: "/boostinglolPay",
    },
    {
      id: 4,
      title: "Placements Boost",
      description: "Asegura tu nueva cuenta con el MMR perfecto!",
      icon: "🛡️",
      color: "gray",
      url: "/boostinglolPay",
    },
    {
      id: 5,
      title: "Boost de la Temporada 15",
      description: "Obtén un inicio perfecto para la nueva temporada!",
      icon: "🔮",
      color: "purple",
      url: "/boostinglolPay",
    },
    {
      id: 6,
      title: "Arena Boost",
      description:
        "Obtén la cantidad de victorias en la Arena de LoL necesarias!",
      icon: "⚔️",
      color: "purple-dark",
      url: "/boostinglolPay",
    },
    {
      id: 7,
      title: "Partidas normales",
      description:
        "Contrata a nuestros boosters para partidas normales de League!",
      icon: "🎮",
      color: "multi-small",
      url: "/boostinglolPay",
    },
    {
      id: 8,
      title: "Maestría del Campeón",
      description: "Demuestra tus puntos de maestría más fácilmente que nunca.",
      icon: "👑",
      color: "champion",
      url: "/boostinglolPay",
    },
  ];

  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        let { data, error } = await supabase.from("accounts").select("*");

        if (error) {
          throw error;
        }
        setAccounts(data || []); // ← Agregado fallback por si data es null
      } catch (error) {
        console.error("Error fetching accounts:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, []);

  // Renderizado condicional del mensaje de carga
  if (loading) {
    return <div>Cargando...</div>;
  }

  const cuentasOrdenadas = accounts.sort(
    (a, b) => new Date(a.fecha_creacion) - new Date(b.fecha_creacion)
  );

  return (
    <div className="lol-page">
      <Navbarlol />

      <div className="main-content">
        <div className="hero-section-lol">
          <div className="hero-content">
            <div className="logo-container">
              <img
                src="/logo-lol.png"
                alt="League of Legends"
                className="lol-logo"
              />
            </div>
            <div className="header-content">
              <h1>League of Legends Servicios</h1>
              <p>
                Compra Boosting, Coaching, Cuentas y más de LoL del mejor
                proveedor de servicios de League of Legends del mundo.
              </p>
            </div>
          </div>
        </div>

        <section className="services-section">
          <div className="services-grid-lol">
            {services.map((service) => (
              <a
                key={service.id}
                className="service-link-lol"
                href={service.url}
              >
                <div className={`service-card-lol ${service.color}`}>
                  <div className="service-icon-lol">
                    <div className={`icon-wrapper-lol ${service.color}`}>
                      {service.icon}
                    </div>
                  </div>
                  <div className="service-content-lol">
                    <h3>{service.title}</h3>
                    <p>{service.description}</p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>

        <section className="">
          {/* Agregado título y verificación de cuentas */}
          <h2>Cuentas Disponibles</h2>
          {accounts.length > 0 ? (
            <div className="accounts-grid">
              {cuentasOrdenadas.map((account) => (
                <AccountCard key={account.id} account={account} />
              ))}
            </div>
          ) : (
            <p>No hay cuentas disponibles en este momento.</p>
          )}
        </section>
      </div>
    </div>
  );
}

export default LolPage;
