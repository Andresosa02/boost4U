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

      // Limpiar datos temporales antes de enviar
      const cleanData = { ...publishData };
      delete cleanData.rankTier;
      delete cleanData.rankDivision;
      delete cleanData.flexRankTier;
      delete cleanData.flexRankDivision;

      const accountData = {
        ...cleanData,
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
              <label htmlFor="region">Servidor *</label>
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
                <option value="LAN">LAN</option>
                <option value="LAS">LAS</option>
                <option value="OCE">OCE</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="rank">Rango *</label>
              <div style={{ display: "flex", gap: "10px" }}>
                <select
                  id="rank"
                  value={publishData.rankTier || ""}
                  onChange={(e) => {
                    const tier = e.target.value;
                    setPublishData({
                      ...publishData,
                      rankTier: tier,
                      rank:
                        tier === "Master" ||
                        tier === "Grandmaster" ||
                        tier === "Challenger"
                          ? tier
                          : `${tier} ${publishData.rankDivision || "I"}`,
                    });
                  }}
                  required
                >
                  <option value="">Seleccionar rango</option>
                  <option value="Iron">Iron</option>
                  <option value="Bronze">Bronze</option>
                  <option value="Silver">Silver</option>
                  <option value="Gold">Gold</option>
                  <option value="Platinum">Platinum</option>
                  <option value="Emerald">Emerald</option>
                  <option value="Diamond">Diamond</option>
                  <option value="Master">Master</option>
                  <option value="Grandmaster">Grandmaster</option>
                  <option value="Challenger">Challenger</option>
                </select>
                <select
                  id="rankDivision"
                  value={publishData.rankDivision || ""}
                  onChange={(e) => {
                    const division = e.target.value;
                    setPublishData({
                      ...publishData,
                      rankDivision: division,
                      rank:
                        publishData.rankTier === "Master" ||
                        publishData.rankTier === "Grandmaster" ||
                        publishData.rankTier === "Challenger"
                          ? publishData.rankTier
                          : `${publishData.rankTier} ${division}`,
                    });
                  }}
                  disabled={
                    publishData.rankTier === "Master" ||
                    publishData.rankTier === "Grandmaster" ||
                    publishData.rankTier === "Challenger"
                  }
                >
                  <option value="">División</option>
                  <option value="I">I</option>
                  <option value="II">II</option>
                  <option value="III">III</option>
                  <option value="IV">IV</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="description">Descripción *</label>
              <textarea
                id="description"
                value={publishData.description || ""}
                onChange={(e) =>
                  setPublishData({
                    ...publishData,
                    description: e.target.value,
                  })
                }
                required
                rows="3"
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

            <div className="form-group">
              <label htmlFor="level">Nivel</label>
              <input
                type="number"
                id="level"
                value={publishData.level || ""}
                onChange={(e) =>
                  setPublishData({ ...publishData, level: e.target.value })
                }
                min="0"
              />
            </div>

            <div className="form-group">
              <label htmlFor="be">Blue Essence</label>
              <input
                type="number"
                id="be"
                value={publishData.be || ""}
                onChange={(e) =>
                  setPublishData({ ...publishData, be: e.target.value })
                }
                min="0"
              />
            </div>

            <div className="form-group">
              <label htmlFor="rp">Riot Points</label>
              <input
                type="number"
                id="rp"
                value={publishData.rp || ""}
                onChange={(e) =>
                  setPublishData({ ...publishData, rp: e.target.value })
                }
                min="0"
              />
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
              <label>
                <input
                  type="checkbox"
                  checked={publishData.isFeatured || false}
                  onChange={(e) =>
                    setPublishData({
                      ...publishData,
                      isFeatured: e.target.checked,
                    })
                  }
                />
                Featured
              </label>
            </div>

            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  checked={publishData.instantDelivery || false}
                  onChange={(e) =>
                    setPublishData({
                      ...publishData,
                      instantDelivery: e.target.checked,
                    })
                  }
                />
                Instant Delivery
              </label>
            </div>

            <div className="form-group">
              <label htmlFor="roles">Roles</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                {["ADC", "TOP", "MID", "SUP", "JG"].map((role) => (
                  <label
                    key={role}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={publishData.roles?.includes(role) || false}
                      onChange={(e) => {
                        const currentRoles = publishData.roles || [];
                        if (e.target.checked) {
                          setPublishData({
                            ...publishData,
                            roles: [...currentRoles, role],
                          });
                        } else {
                          setPublishData({
                            ...publishData,
                            roles: currentRoles.filter((r) => r !== role),
                          });
                        }
                      }}
                    />
                    {role}
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="flexRank">Flex Rank</label>
              <div style={{ display: "flex", gap: "10px" }}>
                <select
                  id="flexRankTier"
                  value={publishData.flexRankTier || ""}
                  onChange={(e) => {
                    const tier = e.target.value;
                    setPublishData({
                      ...publishData,
                      flexRankTier: tier,
                      flexRank:
                        tier === "Master" ||
                        tier === "Grandmaster" ||
                        tier === "Challenger"
                          ? tier
                          : `${tier} ${publishData.flexRankDivision || "I"}`,
                    });
                  }}
                >
                  <option value="">Seleccionar rango</option>
                  <option value="Iron">Iron</option>
                  <option value="Bronze">Bronze</option>
                  <option value="Silver">Silver</option>
                  <option value="Gold">Gold</option>
                  <option value="Platinum">Platinum</option>
                  <option value="Emerald">Emerald</option>
                  <option value="Diamond">Diamond</option>
                  <option value="Master">Master</option>
                  <option value="Grandmaster">Grandmaster</option>
                  <option value="Challenger">Challenger</option>
                </select>
                <select
                  id="flexRankDivision"
                  value={publishData.flexRankDivision || ""}
                  onChange={(e) => {
                    const division = e.target.value;
                    setPublishData({
                      ...publishData,
                      flexRankDivision: division,
                      flexRank:
                        publishData.flexRankTier === "Master" ||
                        publishData.flexRankTier === "Grandmaster" ||
                        publishData.flexRankTier === "Challenger"
                          ? publishData.flexRankTier
                          : `${publishData.flexRankTier} ${division}`,
                    });
                  }}
                  disabled={
                    publishData.flexRankTier === "Master" ||
                    publishData.flexRankTier === "Grandmaster" ||
                    publishData.flexRankTier === "Challenger"
                  }
                >
                  <option value="">División</option>
                  <option value="I">I</option>
                  <option value="II">II</option>
                  <option value="III">III</option>
                  <option value="IV">IV</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="user">Usuario *</label>
              <input
                type="text"
                id="user"
                value={publishData.user || ""}
                onChange={(e) =>
                  setPublishData({ ...publishData, user: e.target.value })
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

            <div className="form-actions">
              <button
                type="button"
                onClick={() => (setShowPublishForm(false), setSelectedGame(""))}
              >
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
              <label htmlFor="entorno">Plataforma *</label>
              <select
                id="entorno"
                value={publishData.entorno || ""}
                onChange={(e) =>
                  setPublishData({ ...publishData, entorno: e.target.value })
                }
                required
              >
                <option value="">Seleccionar plataforma</option>
                <option value="PC">PC</option>
                <option value="Xbox">Xbox</option>
                <option value="PlayStation">PlayStation</option>
                <option value="Android">Android</option>
                <option value="IOS">IOS</option>
                <option value="Switch">Switch</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="description">Descripción *</label>
              <textarea
                id="description"
                value={publishData.description || ""}
                onChange={(e) =>
                  setPublishData({
                    ...publishData,
                    description: e.target.value,
                  })
                }
                required
                rows="3"
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
              <label htmlFor="V_Bucks">V-Bucks</label>
              <input
                type="number"
                id="V_Bucks"
                value={publishData.V_Bucks || ""}
                onChange={(e) =>
                  setPublishData({ ...publishData, V_Bucks: e.target.value })
                }
                min="0"
              />
            </div>

            <div className="form-group">
              <label htmlFor="emotes">Emotes</label>
              <input
                type="number"
                id="emotes"
                value={publishData.emotes || ""}
                onChange={(e) =>
                  setPublishData({ ...publishData, emotes: e.target.value })
                }
                min="0"
              />
            </div>

            <div className="form-group">
              <label htmlFor="pickaxes">Pickaxes</label>
              <input
                type="number"
                id="pickaxes"
                value={publishData.pickaxes || ""}
                onChange={(e) =>
                  setPublishData({ ...publishData, pickaxes: e.target.value })
                }
                min="0"
              />
            </div>

            <div className="form-group">
              <label htmlFor="backBlings">Backblings</label>
              <input
                type="number"
                id="backBlings"
                value={publishData.backBlings || ""}
                onChange={(e) =>
                  setPublishData({ ...publishData, backBlings: e.target.value })
                }
                min="0"
              />
            </div>

            <div className="form-group">
              <label htmlFor="gliders">Gliders</label>
              <input
                type="number"
                id="gliders"
                value={publishData.gliders || ""}
                onChange={(e) =>
                  setPublishData({ ...publishData, gliders: e.target.value })
                }
                min="0"
              />
            </div>

            <div className="form-group">
              <label htmlFor="wraps">Wraps</label>
              <input
                type="number"
                id="wraps"
                value={publishData.wraps || ""}
                onChange={(e) =>
                  setPublishData({ ...publishData, wraps: e.target.value })
                }
                min="0"
              />
            </div>

            <div className="form-group">
              <label htmlFor="loadings">Loadings</label>
              <input
                type="number"
                id="loadings"
                value={publishData.loadings || ""}
                onChange={(e) =>
                  setPublishData({ ...publishData, loadings: e.target.value })
                }
                min="0"
              />
            </div>

            <div className="form-group">
              <label htmlFor="sprays">Sprays</label>
              <input
                type="number"
                id="sprays"
                value={publishData.sprays || ""}
                onChange={(e) =>
                  setPublishData({ ...publishData, sprays: e.target.value })
                }
                min="0"
              />
            </div>

            <div className="form-group">
              <label htmlFor="level">Nivel</label>
              <input
                type="number"
                id="level"
                value={publishData.level || ""}
                onChange={(e) =>
                  setPublishData({ ...publishData, level: e.target.value })
                }
                min="0"
              />
            </div>

            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  checked={publishData.isFeatured || false}
                  onChange={(e) =>
                    setPublishData({
                      ...publishData,
                      isFeatured: e.target.checked,
                    })
                  }
                />
                Featured
              </label>
            </div>

            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  checked={publishData.instantDeli || false}
                  onChange={(e) =>
                    setPublishData({
                      ...publishData,
                      instantDeli: e.target.checked,
                    })
                  }
                />
                Instant Delivery
              </label>
            </div>

            <div className="form-group">
              <label htmlFor="accountType">Account Type</label>
              <select
                id="accountType"
                value={publishData.accountType || ""}
                onChange={(e) =>
                  setPublishData({
                    ...publishData,
                    accountType: e.target.value,
                  })
                }
              >
                <option value="">Seleccionar tipo</option>
                <option value="OG Account">OG Account</option>
                <option value="Original Email">Original Email</option>
                <option value="Stacked">Stacked</option>
                <option value="Save The World">Save The World</option>
                <option value="Battle Royale">Battle Royale</option>
                <option value="The Crew">The Crew</option>
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
              <label htmlFor="user">Usuario *</label>
              <input
                type="text"
                id="user"
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

            <div className="form-actions">
              <button
                type="button"
                onClick={() => (setShowPublishForm(false), setSelectedGame(""))}
              >
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
              <label htmlFor="region">Servidor *</label>
              <select
                id="region"
                value={publishData.region || ""}
                onChange={(e) =>
                  setPublishData({ ...publishData, region: e.target.value })
                }
                required
              >
                <option value="">Seleccionar servidor</option>
                <option value="EU">EU</option>
                <option value="NA">NA</option>
                <option value="LATAM">LATAM</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="rank">Rango *</label>
              <div style={{ display: "flex", gap: "10px" }}>
                <select
                  id="rank"
                  value={publishData.rankTier || ""}
                  onChange={(e) => {
                    const tier = e.target.value;
                    setPublishData({
                      ...publishData,
                      rankTier: tier,
                      rank:
                        tier === "Immortal" || tier === "Radiant"
                          ? tier
                          : `${tier} ${publishData.rankDivision || "1"}`,
                    });
                  }}
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
                <select
                  id="rankDivision"
                  value={publishData.rankDivision || ""}
                  onChange={(e) => {
                    const division = e.target.value;
                    setPublishData({
                      ...publishData,
                      rankDivision: division,
                      rank:
                        publishData.rankTier === "Immortal" ||
                        publishData.rankTier === "Radiant"
                          ? publishData.rankTier
                          : `${publishData.rankTier} ${division}`,
                    });
                  }}
                  disabled={
                    publishData.rankTier === "Immortal" ||
                    publishData.rankTier === "Radiant"
                  }
                >
                  <option value="">División</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="description">Descripción *</label>
              <textarea
                id="description"
                value={publishData.description || ""}
                onChange={(e) =>
                  setPublishData({
                    ...publishData,
                    description: e.target.value,
                  })
                }
                required
                rows="3"
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
              <label htmlFor="level">Nivel</label>
              <input
                type="number"
                id="level"
                value={publishData.level || ""}
                onChange={(e) =>
                  setPublishData({ ...publishData, level: e.target.value })
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

            <div className="form-group">
              <label htmlFor="rp">Riot Points</label>
              <input
                type="number"
                id="rp"
                value={publishData.rp || ""}
                onChange={(e) =>
                  setPublishData({ ...publishData, rp: e.target.value })
                }
                min="0"
              />
            </div>

            <div className="form-group">
              <label htmlFor="plataform">Plataforma</label>
              <select
                id="plataform"
                value={publishData.plataform || ""}
                onChange={(e) =>
                  setPublishData({ ...publishData, plataform: e.target.value })
                }
              >
                <option value="">Seleccionar plataforma</option>
                <option value="PC">PC</option>
                <option value="Xbox">Xbox</option>
                <option value="PlayStation">PlayStation</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="rankedWinrate">Ranked Winrate</label>
              <input
                type="number"
                id="rankedWinrate"
                value={publishData.rankedWinrate || ""}
                onChange={(e) => {
                  const value = Math.min(
                    100,
                    Math.max(0, parseInt(e.target.value) || 0)
                  );
                  setPublishData({ ...publishData, rankedWinrate: value });
                }}
                min="0"
                max="100"
              />
            </div>

            <div className="form-group">
              <label htmlFor="buddies">Buddies</label>
              <input
                type="number"
                id="buddies"
                value={publishData.buddies || ""}
                onChange={(e) =>
                  setPublishData({ ...publishData, buddies: e.target.value })
                }
                min="0"
              />
            </div>

            <div className="form-group">
              <label htmlFor="sprays">Sprays</label>
              <input
                type="number"
                id="sprays"
                value={publishData.sprays || ""}
                onChange={(e) =>
                  setPublishData({ ...publishData, sprays: e.target.value })
                }
                min="0"
              />
            </div>

            <div className="form-group">
              <label htmlFor="cards">Cards</label>
              <input
                type="number"
                id="cards"
                value={publishData.cards || ""}
                onChange={(e) =>
                  setPublishData({ ...publishData, cards: e.target.value })
                }
                min="0"
              />
            </div>

            <div className="form-group">
              <label htmlFor="titles">Titles</label>
              <input
                type="number"
                id="titles"
                value={publishData.titles || ""}
                onChange={(e) =>
                  setPublishData({ ...publishData, titles: e.target.value })
                }
                min="0"
              />
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
              <label>
                <input
                  type="checkbox"
                  checked={publishData.isFeatured || false}
                  onChange={(e) =>
                    setPublishData({
                      ...publishData,
                      isFeatured: e.target.checked,
                    })
                  }
                />
                Featured
              </label>
            </div>

            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  checked={publishData.instantDelivery || false}
                  onChange={(e) =>
                    setPublishData({
                      ...publishData,
                      instantDelivery: e.target.checked,
                    })
                  }
                />
                Instant Delivery
              </label>
            </div>

            <div className="form-group">
              <label htmlFor="user">Usuario *</label>
              <input
                type="text"
                id="user"
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

            <div className="form-actions">
              <button
                type="button"
                onClick={() => (setShowPublishForm(false), setSelectedGame(""))}
              >
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
