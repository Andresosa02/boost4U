import React, { useState, useEffect } from "react";
import NavbarUsers from "../../components/ui/navbarUsers";
import supabase from "../../supabaseClient";
import { getUserRole } from "../../utils/roles";
import "../../styles/Dashboard.css";

export const Sales = () => {
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [showPublishForm, setShowPublishForm] = useState(false);
  const [selectedGame, setSelectedGame] = useState("");

  // Estados para el formulario de aplicación
  const [applicationData, setApplicationData] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
  });

  // Estados para el formulario de publicación
  const [publishData, setPublishData] = useState({});

  useEffect(() => {
    checkUserRole();
  }, []);

  const checkUserRole = async () => {
    const role = await getUserRole();
    setUserRole(role);
    setLoading(false);
  };

  const handleApplicationSubmit = async (e) => {
    e.preventDefault();

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuario no autenticado");

      const { data: profile } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", user.id)
        .single();

      const { error } = await supabase.from("sellerApplications").insert({
        user_id: profile.id,
        ...applicationData,
      });

      if (error) throw error;

      alert(
        "Solicitud enviada exitosamente. Serás notificado por email cuando sea revisada."
      );
      setShowApplicationForm(false);
      setApplicationData({
        first_name: "",
        last_name: "",
        phone: "",
        email: "",
      });
    } catch (error) {
      console.error("Error submitting application:", error);
      alert("Error al enviar la solicitud");
    }
  };

  const handlePublishSubmit = async (e) => {
    e.preventDefault();

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuario no autenticado");

      const { data: seller } = await supabase
        .from("profileSellers") // a cambiar
        .select("id")
        .eq("id", user.id)
        .single();

      if (!seller) throw new Error("No eres un vendedor autorizado");

      const accountData = {
        ...publishData,
        seller_id: seller.id,
        published_at: new Date().toISOString(),
      };

      let tableName = "";
      switch (selectedGame) {
        case "lol":
          tableName = "accounts";
          break;
        case "fortnite":
          tableName = "accountFornite";
          break;
        case "valorant":
          tableName = "accountValorant";
          break;
        default:
          throw new Error("Juego no válido");
      }

      const { error } = await supabase.from(tableName).insert(accountData);

      if (error) throw error;

      alert("Cuenta publicada exitosamente");
      setShowPublishForm(false);
      setPublishData({});
      setSelectedGame("");
    } catch (error) {
      console.error("Error publishing account:", error);
      alert("Error al publicar la cuenta");
    }
  };

  const renderApplicationForm = () => (
    <div className="application-form">
      <h2>¿Quieres ser vendedor?</h2>
      <p>
        Completa el formulario para aplicar como vendedor en nuestra plataforma.
      </p>

      <form onSubmit={handleApplicationSubmit}>
        <div className="form-group">
          <label htmlFor="first_name">Nombre *</label>
          <input
            type="text"
            id="first_name"
            value={applicationData.first_name}
            onChange={(e) =>
              setApplicationData({
                ...applicationData,
                first_name: e.target.value,
              })
            }
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="last_name">Apellido *</label>
          <input
            type="text"
            id="last_name"
            value={applicationData.last_name}
            onChange={(e) =>
              setApplicationData({
                ...applicationData,
                last_name: e.target.value,
              })
            }
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">Número de teléfono *</label>
          <input
            type="tel"
            id="phone"
            value={applicationData.phone}
            onChange={(e) =>
              setApplicationData({ ...applicationData, phone: e.target.value })
            }
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email *</label>
          <input
            type="email"
            id="email"
            value={applicationData.email}
            onChange={(e) =>
              setApplicationData({ ...applicationData, email: e.target.value })
            }
            required
          />
        </div>

        <div className="form-actions">
          <button type="button" onClick={() => setShowApplicationForm(false)}>
            Cancelar
          </button>
          <button type="submit">Enviar Solicitud</button>
        </div>
      </form>
    </div>
  );

  const renderGameSelection = () => (
    <div className="game-selection">
      <h2>Selecciona el juego</h2>
      <div className="games-grid">
        <button
          className="game-card"
          onClick={() => {
            setSelectedGame("lol");
            setShowPublishForm(true);
          }}
        >
          <h3>League of Legends</h3>
          <p>Publicar cuenta de LoL</p>
        </button>

        <button
          className="game-card"
          onClick={() => {
            setSelectedGame("fortnite");
            setShowPublishForm(true);
          }}
        >
          <h3>Fortnite</h3>
          <p>Publicar cuenta de Fortnite</p>
        </button>

        <button
          className="game-card"
          onClick={() => {
            setSelectedGame("valorant");
            setShowPublishForm(true);
          }}
        >
          <h3>Valorant</h3>
          <p>Publicar cuenta de Valorant</p>
        </button>
      </div>
    </div>
  );

  const renderPublishForm = () => {
    if (selectedGame === "lol") {
      return (
        <div className="publish-form">
          <h2>Publicar Cuenta de League of Legends</h2>
          <form onSubmit={handlePublishSubmit}>
            <div className="form-group">
              <label htmlFor="username">Description *</label>
              <input
                type="text"
                id="username"
                value={publishData.description || ""}
                onChange={(e) =>
                  setPublishData({
                    ...publishData,
                    description: e.target.value,
                  })
                }
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="server">Servidor *</label>
              <select
                id="region"
                value={publishData.region || ""}
                onChange={(e) =>
                  setPublishData({ ...publishData, region: e.target.value })
                }
                required
              >
                <option value="">Seleccionar servidor</option>
                <option value="EUW">EUW</option>
                <option value="EUNE">EUNE</option>
                <option value="NA">NA</option>
                <option value="BR">BR</option>
                <option value="LAN">LAN</option>
                <option value="LAS">LAS</option>
                <option value="OCE">OCE</option>
                <option value="RU">RU</option>
                <option value="TR">TR</option>
                <option value="JP">JP</option>
                <option value="KR">KR</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="rank">Rango *</label>
              <select
                id="rank"
                value={publishData.rank || ""}
                onChange={(e) =>
                  setPublishData({ ...publishData, rank: e.target.value })
                }
                required
              >
                <option value="">Seleccionar rango</option>
                <option value="Iron">Iron</option>
                <option value="Bronze">Bronze</option>
                <option value="Silver">Silver</option>
                <option value="Gold">Gold</option>
                <option value="Platinum">Platinum</option>
                <option value="Diamond">Diamond</option>
                <option value="Master">Master</option>
                <option value="Grandmaster">Grandmaster</option>
                <option value="Challenger">Challenger</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="price">Precio *</label>
              <input
                type="number"
                id="price"
                value={publishData.price || ""}
                onChange={(e) =>
                  setPublishData({ ...publishData, price: e.target.value })
                }
                required
                min="0"
                step="0.01"
              />
            </div>

            <div className="form-group">
              <label htmlFor="champions">Número de campeones</label>
              <input
                type="number"
                id="champions"
                value={publishData.champions || ""}
                onChange={(e) =>
                  setPublishData({ ...publishData, champions: e.target.value })
                }
                min="0"
              />
            </div>

            <div className="form-group">
              <label htmlFor="skins">Número de skins</label>
              <input
                type="number"
                id="skins"
                value={publishData.skins || ""}
                onChange={(e) =>
                  setPublishData({ ...publishData, skins: e.target.value })
                }
                min="0"
              />
            </div>

            <div className="form-actions">
              <button type="button" onClick={() => setShowPublishForm(false)}>
                Cancelar
              </button>
              <button type="submit">Publicar Cuenta</button>
            </div>
          </form>
        </div>
      );
    }

    if (selectedGame === "fortnite") {
      return (
        <div className="publish-form">
          <h2>Publicar Cuenta de Fortnite</h2>
          <form onSubmit={handlePublishSubmit}>
            <div className="form-group">
              <label htmlFor="username">Nombre de usuario *</label>
              <input
                type="text"
                id="username"
                value={publishData.username || ""}
                onChange={(e) =>
                  setPublishData({ ...publishData, username: e.target.value })
                }
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Contraseña *</label>
              <input
                type="password"
                id="password"
                value={publishData.password || ""}
                onChange={(e) =>
                  setPublishData({ ...publishData, password: e.target.value })
                }
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="platform">Plataforma *</label>
              <select
                id="platform"
                value={publishData.platform || ""}
                onChange={(e) =>
                  setPublishData({ ...publishData, platform: e.target.value })
                }
                required
              >
                <option value="">Seleccionar plataforma</option>
                <option value="PC">PC</option>
                <option value="PlayStation">PlayStation</option>
                <option value="Xbox">Xbox</option>
                <option value="Nintendo Switch">Nintendo Switch</option>
                <option value="Mobile">Mobile</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="account_type">Tipo de cuenta *</label>
              <select
                id="account_type"
                value={publishData.account_type || ""}
                onChange={(e) =>
                  setPublishData({
                    ...publishData,
                    account_type: e.target.value,
                  })
                }
                required
              >
                <option value="">Seleccionar tipo</option>
                <option value="Starter">Starter</option>
                <option value="Standard">Standard</option>
                <option value="Deluxe">Deluxe</option>
                <option value="Super Deluxe">Super Deluxe</option>
                <option value="Ultimate">Ultimate</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="price">Precio *</label>
              <input
                type="number"
                id="price"
                value={publishData.price || ""}
                onChange={(e) =>
                  setPublishData({ ...publishData, price: e.target.value })
                }
                required
                min="0"
                step="0.01"
              />
            </div>

            <div className="form-group">
              <label htmlFor="skins">Número de skins</label>
              <input
                type="number"
                id="skins"
                value={publishData.skins || ""}
                onChange={(e) =>
                  setPublishData({ ...publishData, skins: e.target.value })
                }
                min="0"
              />
            </div>

            <div className="form-group">
              <label htmlFor="vbucks">V-Bucks</label>
              <input
                type="number"
                id="vbucks"
                value={publishData.vbucks || ""}
                onChange={(e) =>
                  setPublishData({ ...publishData, vbucks: e.target.value })
                }
                min="0"
              />
            </div>

            <div className="form-actions">
              <button type="button" onClick={() => setShowPublishForm(false)}>
                Cancelar
              </button>
              <button type="submit">Publicar Cuenta</button>
            </div>
          </form>
        </div>
      );
    }

    if (selectedGame === "valorant") {
      return (
        <div className="publish-form">
          <h2>Publicar Cuenta de Valorant</h2>
          <form onSubmit={handlePublishSubmit}>
            <div className="form-group">
              <label htmlFor="username">Nombre de usuario *</label>
              <input
                type="text"
                id="username"
                value={publishData.username || ""}
                onChange={(e) =>
                  setPublishData({ ...publishData, username: e.target.value })
                }
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Contraseña *</label>
              <input
                type="password"
                id="password"
                value={publishData.password || ""}
                onChange={(e) =>
                  setPublishData({ ...publishData, password: e.target.value })
                }
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="server">Servidor *</label>
              <select
                id="server"
                value={publishData.server || ""}
                onChange={(e) =>
                  setPublishData({ ...publishData, server: e.target.value })
                }
                required
              >
                <option value="">Seleccionar servidor</option>
                <option value="NA">NA</option>
                <option value="EU">EU</option>
                <option value="AP">AP</option>
                <option value="KR">KR</option>
                <option value="BR">BR</option>
                <option value="LATAM">LATAM</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="rank">Rango *</label>
              <select
                id="rank"
                value={publishData.rank || ""}
                onChange={(e) =>
                  setPublishData({ ...publishData, rank: e.target.value })
                }
                required
              >
                <option value="">Seleccionar rango</option>
                <option value="Iron">Iron</option>
                <option value="Bronze">Bronze</option>
                <option value="Silver">Silver</option>
                <option value="Gold">Gold</option>
                <option value="Platinum">Platinum</option>
                <option value="Diamond">Diamond</option>
                <option value="Ascendant">Ascendant</option>
                <option value="Immortal">Immortal</option>
                <option value="Radiant">Radiant</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="price">Precio *</label>
              <input
                type="number"
                id="price"
                value={publishData.price || ""}
                onChange={(e) =>
                  setPublishData({ ...publishData, price: e.target.value })
                }
                required
                min="0"
                step="0.01"
              />
            </div>

            <div className="form-group">
              <label htmlFor="agents">Número de agentes</label>
              <input
                type="number"
                id="agents"
                value={publishData.agents || ""}
                onChange={(e) =>
                  setPublishData({ ...publishData, agents: e.target.value })
                }
                min="0"
              />
            </div>

            <div className="form-group">
              <label htmlFor="skins">Número de skins</label>
              <input
                type="number"
                id="skins"
                value={publishData.skins || ""}
                onChange={(e) =>
                  setPublishData({ ...publishData, skins: e.target.value })
                }
                min="0"
              />
            </div>

            <div className="form-group">
              <label htmlFor="vp">Valorant Points</label>
              <input
                type="number"
                id="vp"
                value={publishData.vp || ""}
                onChange={(e) =>
                  setPublishData({ ...publishData, vp: e.target.value })
                }
                min="0"
              />
            </div>

            <div className="form-actions">
              <button type="button" onClick={() => setShowPublishForm(false)}>
                Cancelar
              </button>
              <button type="submit">Publicar Cuenta</button>
            </div>
          </form>
        </div>
      );
    }

    return null;
  };

  if (loading) {
    return (
      <div>
        <NavbarUsers />
        <div className="contenedor">
          <div className="loading">Cargando...</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <NavbarUsers />
      <div className="contenedor">
        <h1>Sales</h1>

        {userRole === "user" && !showApplicationForm && (
          <div className="sales-message">
            <h2>¿Quieres ser vendedor?</h2>
            <p>
              Únete a nuestro equipo de vendedores y comienza a ganar dinero
              vendiendo cuentas de videojuegos.
            </p>
            <button
              className="btn-primary"
              onClick={() => setShowApplicationForm(true)}
            >
              Aplicar como Vendedor
            </button>
          </div>
        )}

        {(userRole === "seller" || userRole === "admin") &&
          !showPublishForm && (
            <div className="seller-dashboard">
              <h2>Panel de Vendedor</h2>
              <p>
                Bienvenido al panel de vendedor. Aquí puedes publicar nuevas
                cuentas.
              </p>
              <button
                className="btn-primary"
                onClick={() => setShowPublishForm(true)}
              >
                Publicar Cuenta
              </button>
            </div>
          )}

        {showApplicationForm && renderApplicationForm()}
        {showPublishForm && !selectedGame && renderGameSelection()}
        {showPublishForm && selectedGame && renderPublishForm()}
      </div>
    </div>
  );
};

export default Sales;
