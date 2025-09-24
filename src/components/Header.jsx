// src/components/Header.jsx

import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { Link, useLocation, useNavigate } from "react-router-dom"; // Importa useNavigate
import AuthModal from "./Login";
import supabase from "../supabaseClient";
import User from "../components/user";
import "../App.css";

export const Header = () => {
  const location = useLocation();
  const navigate = useNavigate(); // Hook para navegación programática
  const isHomePage = location.pathname === "/";

  // Estados para controlar la visibilidad de los menús
  const [isGamesOpen, setIsGamesOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);

  // Estados para el juego seleccionado y listas de juegos
  const [juegoSeleccionado, setJuegoSeleccionado] = useState("");
  const [juegosRecientes, setJuegosRecientes] = useState([]);
  const [juegosPopulares, setJuegosPopulares] = useState([]);
  const [cargandoPopular, setCargandoPopular] = useState(true);

  // Referencias para temporizadores
  const gamesTimeoutRef = useRef(null);
  const servicesTimeoutRef = useRef(null);
  const hoverTimeoutRef = useRef(null);

  // Configuración de tiempos (en milisegundos)
  const MENU_CLOSE_DELAY = 300;
  const HOVER_DELAY = 200;

  const [searchTerm, setSearchTerm] = useState("");

  // Datos de los juegos (optimizado con useMemo si es constante)
  const juegosDisponibles = useMemo(
    () => [
      {
        nombre: "League of Legends",
        imagen:
          "https://i.pinimg.com/originals/d1/b1/1d/d1b11d5e4dbae547ac0d651476cec488.png",
        url: "/lol",
      },
      {
        nombre: "Fortnite",
        imagen:
          "https://upload.wikimedia.org/wikipedia/commons/7/7c/Fortnite_F_lettermark_logo.png",
        url: "/fortnite",
      },
      {
        nombre: "Valorant",
        imagen:
          "https://images.steamusercontent.com/ugc/1009310639741043947/C4780FD7B53B39EFE4A536842FC1281A48A1256F/?imw=268&imh=268&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=true",
        url: "/valorant",
      },
    ],
    []
  );

  const juegosFiltrados = useMemo(() => {
    return juegosDisponibles.filter((juego) =>
      juego.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [juegosDisponibles, searchTerm]);

  // Cargar juegos recientes del localStorage al montar el componente
  useEffect(() => {
    const recientes = JSON.parse(
      localStorage.getItem("juegosRecientes") || "[]"
    );
    setJuegosRecientes(recientes);
  }, []);

  // Función optimizada para agregar un juego a recientes
  const agregarJuegoReciente = useCallback((juego) => {
    setJuegosRecientes((prevRecientes) => {
      const sinDuplicados = prevRecientes.filter(
        (j) => j.nombre !== juego.nombre
      );
      const nuevosRecientes = [juego, ...sinDuplicados].slice(0, 5);
      localStorage.setItem("juegosRecientes", JSON.stringify(nuevosRecientes));
      return nuevosRecientes;
    });
  }, []);

  // Función optimizada para obtener juegos populares
  const obtenerJuegoMasPopular = useCallback(async () => {
    setCargandoPopular(true);
    try {
      // Obtener los 3 juegos más populares directamente desde la tabla
      const { data, error } = await supabase
        .from("popular_games")
        .select("game_name, access_count")
        .order("access_count", { ascending: false })
        .limit(3);

      if (error) throw error;

      if (data && Array.isArray(data)) {
        setJuegosPopulares(data);
      } else {
        setJuegosPopulares([]);
      }
    } catch (error) {
      console.error(
        "Error al obtener los juegos más populares:",
        error && error.message ? error.message : error
      );
      setJuegosPopulares([]);
    } finally {
      setCargandoPopular(false);
    }
  }, []);

  // Llamar a obtenerJuegoMasPopular al montar el componente
  useEffect(() => {
    obtenerJuegoMasPopular();
  }, [obtenerJuegoMasPopular]);

  // Función optimizada para registrar acceso e incrementar contador
  const registrarAccesoAJuego = useCallback(
    async (nombreJuego) => {
      try {
        console.log("Registrando acceso para:", nombreJuego);

        // 1) Intentar leer el registro existente
        const { data: existingData, error: selectError } = await supabase
          .from("popular_games")
          .select("game_name, access_count")
          .eq("game_name", nombreJuego)
          .single();

        if (selectError && selectError.code !== "PGRST116") {
          // PGRST116 en algunos clientes indica "No rows found" al usar .single(); ignorar si no existe
          console.error("Error al leer registro existente:", selectError);
        }

        if (existingData && existingData.game_name) {
          // 2) Si existe, actualizar con el nuevo contador calculado en JS
          const nuevoCount = (Number(existingData.access_count) || 0) + 1;
          const { error: updateError } = await supabase
            .from("popular_games")
            .update({
              access_count: nuevoCount,
              updated_at: new Date().toISOString(),
            })
            .eq("game_name", nombreJuego);

          if (updateError) {
            console.error("Error al actualizar contador:", updateError);
            throw updateError;
          }
        } else {
          // 3) Si no existe, insertar nuevo registro
          const { error: insertError } = await supabase
            .from("popular_games")
            .insert([
              {
                game_name: nombreJuego,
                access_count: 1,
                updated_at: new Date().toISOString(),
              },
            ]);

          if (insertError) {
            // Si existe un conflicto de unique (race condition), intentar actualizar
            if (insertError.code === "23505") {
              console.log(
                "Conflicto de inserción detectado, reintentando actualizar contador..."
              );
              const { error: retryUpdateError } = await supabase
                .from("popular_games")
                .update({
                  access_count: supabase.rpc("access_count + 1"),
                  updated_at: new Date().toISOString(),
                })
                .eq("game_name", nombreJuego);

              if (retryUpdateError) {
                console.error("Error en retry de update:", retryUpdateError);
                throw retryUpdateError;
              }
            } else {
              console.error("Error al insertar nuevo registro:", insertError);
              throw insertError;
            }
          }
        }

        console.log("Acceso registrado exitosamente para:", nombreJuego);

        // Refresca la lista de populares después de registrar el acceso
        obtenerJuegoMasPopular();
      } catch (err) {
        console.error("Error inesperado al registrar el acceso al juego:", err);
      }
    },
    [obtenerJuegoMasPopular]
  );

  // Manejar click en juego (agregar a recientes, navegar y registrar acceso)
  const handleGameClick = useCallback(
    (juego) => {
      // Prevenir el comportamiento por defecto del <a> si es necesario
      // Aunque con useNavigate, podrías considerar usar <button> o <div> con onClick
      // event.preventDefault();

      // Agregar a recientes
      agregarJuegoReciente({
        nombre: juego.nombre,
        imagen: juego.imagen,
        url: juego.url,
        fecha: new Date().toISOString(),
      });

      // Registrar acceso en Supabase
      registrarAccesoAJuego(juego.nombre);

      // Navegar programáticamente con React Router
      // Esto debería resolver el problema del doble click
      navigate(juego.url);

      // Opcional: Cerrar el menú de juegos después del click
      setIsGamesOpen(false);
      setJuegoSeleccionado("");
    },
    [agregarJuegoReciente, registrarAccesoAJuego, navigate]
  );

  // --- Lógica de Menús (optimizada con useCallback) ---

  const handleGamesMouseEnter = useCallback(() => {
    clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = setTimeout(() => {
      setIsGamesOpen(true);
    }, 400);
    clearTimeout(gamesTimeoutRef.current);
  }, []);

  const toggleGames = useCallback(() => {
    setIsGamesOpen((prev) => !prev);
  }, []);

  const handleGamesMouseLeave = useCallback(() => {
    gamesTimeoutRef.current = setTimeout(() => {
      setIsGamesOpen(false);
      setJuegoSeleccionado("");
    }, MENU_CLOSE_DELAY);
  }, []);

  const handleServicesMouseEnter = useCallback(() => {
    clearTimeout(servicesTimeoutRef.current);
    clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = setTimeout(() => {
      setIsServicesOpen(true);
    }, 400);
  }, []);

  const toggleServices = useCallback(() => {
    setIsServicesOpen((prev) => !prev);
  }, []);

  const handleServicesMouseLeave = useCallback(() => {
    servicesTimeoutRef.current = setTimeout(() => {
      setIsServicesOpen(false);
    }, MENU_CLOSE_DELAY);
  }, []);

  const handleGameMouseEnter = useCallback((nombreJuego) => {
    clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = setTimeout(() => {
      setJuegoSeleccionado(nombreJuego);
    }, HOVER_DELAY);
  }, []);

  const handleGameMouseLeave = useCallback(() => {
    clearTimeout(hoverTimeoutRef.current);
  }, []);

  // --- Limpieza de temporizadores al desmontar ---
  useEffect(() => {
    return () => {
      clearTimeout(gamesTimeoutRef.current);
      clearTimeout(servicesTimeoutRef.current);
      clearTimeout(hoverTimeoutRef.current);
    };
  }, []);

  // --- Estados para el modal de autenticación ---
  const [isAuthModalVisible, setIsAuthModalVisible] = useState(false);
  const [isLoginButtonOpen, setIsLoginButtonOpen] = useState(false);
  const [isUserOpen, setIsUserOpen] = useState(false);

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        setIsLoginButtonOpen(true);
        setIsUserOpen(false);
      } else {
        setIsLoginButtonOpen(false);
        setIsUserOpen(true);
      }
    });
  }, []);

  const showAuthModal = useCallback(() => {
    setIsAuthModalVisible(true);
    document.body.style.overflow = "hidden";
  }, []);

  const hideAuthModal = useCallback(() => {
    setIsAuthModalVisible(false);
    document.body.style.overflow = "auto";
  }, []);

  // ------------------------------

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 0;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    document.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      document.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled]);

  return (
    <header
      className={`navbar ${isHomePage ? "" : "black"} ${
        scrolled ? "scrolled" : ""
      }`}
    >
      <nav className="main-nav">
        <ul className="nav-links">
          <div className="logo">
            <Link to="/">Boost4U</Link>
          </div>

          {/* --- MENÚ DE JUEGOS --- */}
          <li
            className="nav-item"
            onMouseEnter={handleGamesMouseEnter}
            onMouseLeave={handleGamesMouseLeave}
          >
            <span onClick={toggleGames}>
              Juegos
              <svg
                width="12"
                height="10"
                viewBox="0 0 12 12"
                fill="currentColor"
              >
                <path d="M2.5 4.5L6 8L9.5 4.5H2.5Z" />
              </svg>
            </span>

            {isGamesOpen && (
              <div className="dropdown-menuGames game-dropdown">
                <div className="game-menu-container">
                  {/* Columna Izquierda */}
                  <div className="game-menu-sidebar">
                    <h3>Recientes</h3>
                    <ul>
                      {juegosRecientes.length > 0 ? (
                        juegosRecientes.map((juego, index) => (
                          <li key={index} className="game-item-recent">
                            {/* Usamos onClick en lugar de href para control total */}
                            <Link // o <div onClick={() => handleGameClick(juego)}
                              To={juego.url}
                              onMouseEnter={() =>
                                handleGameMouseEnter(juego.nombre)
                              }
                              onMouseLeave={handleGameMouseLeave}
                              onClick={(e) => {
                                e.preventDefault();
                                handleGameClick(juego, e);
                              }}
                            >
                              <img src={juego.imagen} alt={juego.nombre} />
                              {juego.nombre}
                            </Link>
                          </li>
                        ))
                      ) : (
                        <li className="no-recent">
                          <span>No hay juegos recientes</span>
                        </li>
                      )}
                    </ul>

                    <h3>Más popular</h3>
                    <ul>
                      {cargandoPopular ? (
                        <li className="game-item-recent">
                          <span>Cargando...</span>
                        </li>
                      ) : juegosPopulares.length > 0 ? (
                        juegosPopulares.map((juegoPopularItem, index) => {
                          const juegoPopularData = juegosDisponibles.find(
                            (juego) =>
                              juego.nombre === juegoPopularItem.game_name
                          );
                          if (juegoPopularData) {
                            return (
                              <li
                                key={`${juegoPopularItem.game_name}-${index}`}
                                className="game-item-recent"
                              >
                                <Link // o <div onClick={() => handleGameClick(juegoPopularData)}
                                  To={juegoPopularData.url}
                                  onMouseEnter={() =>
                                    handleGameMouseEnter(
                                      juegoPopularData.nombre
                                    )
                                  }
                                  onMouseLeave={handleGameMouseLeave}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleGameClick(juegoPopularData, e);
                                  }}
                                >
                                  <img
                                    src={juegoPopularData.imagen}
                                    alt={juegoPopularData.nombre}
                                  />
                                  {juegoPopularData.nombre}
                                </Link>
                              </li>
                            );
                          } else {
                            return (
                              <li
                                key={`notfound-${index}`}
                                className="game-item-recent"
                              >
                                <span>
                                  {juegoPopularItem.game_name} (Info no
                                  disponible)
                                </span>
                              </li>
                            );
                          }
                        })
                      ) : (
                        <li className="game-item-recent no-recent">
                          <span>No hay datos</span>
                        </li>
                      )}
                    </ul>
                  </div>

                  {/* Columna Central */}
                  <div className="game-menu-main">
                    <div className="search-bar">
                      <input
                        type="text"
                        placeholder="Buscar juegos..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <div className="game-grid">
                      {juegosFiltrados.map((juego, index) => (
                        <Link // o <div onClick={() => handleGameClick(juego)}
                          key={index}
                          To={juego.url}
                          className="game-item"
                          onMouseEnter={() =>
                            handleGameMouseEnter(juego.nombre)
                          }
                          onMouseLeave={handleGameMouseLeave}
                          onClick={(e) => {
                            e.preventDefault();
                            handleGameClick(juego, e);
                          }}
                        >
                          <img src={juego.imagen} alt={juego.nombre} />
                          <span>{juego.nombre}</span>
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Columna Derecha */}
                  <div
                    className={`game-menu-details ${
                      juegoSeleccionado === "League of Legends"
                        ? "fondo-lol"
                        : juegoSeleccionado === "Fortnite"
                        ? "fondo-fortnite"
                        : juegoSeleccionado === "Valorant"
                        ? "fondo-valorant"
                        : "game-menu-details"
                    }`}
                  >
                    {juegoSeleccionado === "League of Legends" && (
                      <div>
                        <h4>League of Legends</h4>
                        <ul>
                          <li>
                            <Link to="/boosting"> Boosting </Link>
                          </li>
                          <li>
                            <Link to="/cuentaslol"> Cuentas </Link>
                          </li>
                          <li>
                            <Link to="/smurfs"> Smurfs hechos a mano</Link>
                          </li>
                        </ul>
                      </div>
                    )}
                    {juegoSeleccionado === "Fortnite" && (
                      <div>
                        <h4>Fortnite</h4>
                        <ul>
                          <li>
                            <Link to="/accountsFortnite">Cuentas</Link>
                          </li>
                        </ul>
                      </div>
                    )}
                    {juegoSeleccionado === "Valorant" && (
                      <div>
                        <h4>Valorant</h4>
                        <ul>
                          <li>
                            <Link to="#">Boosting</Link>
                          </li>
                          <li>
                            <Link to="/cuentasValorant">Cuentas</Link>
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </li>

          {/* --- MENÚ DE SERVICIOS --- */}
          <li
            className="nav-item"
            onMouseEnter={handleServicesMouseEnter}
            onMouseLeave={handleServicesMouseLeave}
          >
            <span onClick={toggleServices}>
              Servicios
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="currentColor"
              >
                <path d="M2.5 4.5L6 8L9.5 4.5H2.5Z" />
              </svg>
            </span>
            {isServicesOpen && (
              <div className="dropdown-menuServices services-dropdown">
                <div className="services-container">
                  <div className="services-menu-container">
                    <div className="Services-main">
                      <div className="services-grid">
                        <Link to="/cuentas" className="service-item">
                          <div className="service-icon">👤</div>
                          <div className="service-details">
                            <h4>Cuentas</h4>
                            <p>Obtén cuentas de juegos al instante</p>
                          </div>
                        </Link>
                        <Link to="#" className="service-item">
                          <div className="service-icon">🚀</div>
                          <div className="service-details">
                            <h4>Boosting</h4>
                            <p>Sube de rango rápidamente con profesionales</p>
                          </div>
                        </Link>
                        <Link to="#" className="service-item">
                          <div className="service-icon">🎮</div>
                          <div className="service-details">
                            <h4>Smurfs</h4>
                            <p>Smurfs hechos a mano</p>
                          </div>
                        </Link>
                      </div>
                    </div>

                    <div className="service-features">
                      <div className="feature-row">
                        <div className="feature-column">
                          <h4>League of Legends</h4>
                          <ul>
                            <li>
                              <Link to="/boosting"> Boosting </Link>
                            </li>
                            <li>
                              <Link to="/cuentaslol"> Cuentas </Link>
                            </li>
                            <li>
                              <Link to="/smurfs"> Smurfs hechos a mano</Link>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="services-footer">
                    <div className="services-guarantees">
                      <div className="tooltip-container">
                        <span>
                          <span className="feature-icon">✅</span>Garantía
                          gratuita
                        </span>
                        <span className="tooltip-text">
                          *Most of our products are delivered instantly or
                          within the delivery time set in the offer.
                        </span>
                      </div>
                      <div className="tooltip-container">
                        <span>
                          <span className="feature-icon">⭐</span>+1.3M Reseñas
                        </span>
                        <span className="tooltip-text">
                          *Most of our products are delivered instantly or
                          within the delivery time set in the offer.
                        </span>
                      </div>
                      <div className="tooltip-container">
                        <span>
                          <span className="feature-icon">⚡</span>Entrega
                          instantánea
                        </span>
                        <span className="tooltip-text">
                          *Most of our products are delivered instantly or
                          within the delivery time set in the offer.
                        </span>
                      </div>
                      <div className="tooltip-container">
                        <span>
                          <span className="feature-icon">🛡️</span>Soporte 24/7
                        </span>
                        <span className="tooltip-text">
                          *Most of our products are delivered instantly or
                          within the delivery time set in the offer.
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </li>
        </ul>
      </nav>
      <div>
        {isUserOpen && (
          <div>
            <div>
              <User />
            </div>
          </div>
        )}
        {isLoginButtonOpen && (
          <div>
            <div className="auth-buttons">
              <button onClick={showAuthModal} className="login-button">
                Sign up
              </button>
            </div>

            <AuthModal isVisible={isAuthModalVisible} onClose={hideAuthModal} />
          </div>
        )}
      </div>
    </header>
  );
};
