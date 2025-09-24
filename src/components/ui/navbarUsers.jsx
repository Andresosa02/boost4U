import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import supabase from "../../supabaseClient";
import styles from "./Navbar.module.css";

export const NavbarUsers = () => {
  const [user, setUser] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);

  useEffect(() => {
    // Obtener usuario actual
    const getUser = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          const { data, error, status } = await supabase
            .from("profiles")
            .select(`username, avatar_url`)
            .eq("id", user.id)
            .single();

          if (error && status !== 406) {
            throw error;
          }

          if (data) {
            setUser(data.username);
            setProfilePicture(data.avatar_url);
          }
        }
      } catch (error) {
        console.error("Error al obtener el perfil:", error.message);
      }
    };

    getUser();

    // Escuchar cambios de autenticación
  }, []);

  return (
    <nav className={styles.navbar}>
      <div className={styles.navContainer}>
        {/* Sección Izquierda: Logo y Enlaces */}
        <div className={styles.navLeft}>
          <Link to="/orders">
            <img
              src={profilePicture}
              alt="Foto de perfil"
              className={styles.logo}
            />
          </Link>
          <Link className={styles.titulo} to="/orders">
            <p>{user}</p>
          </Link>
        </div>
        <div className={styles.navLinks}>
          <ul className={styles.navList}>
            <li className={styles.navItem}>
              <Link to="#" className={styles.navLink}>
                Orders
              </Link>
            </li>
            <li className={styles.navItem}>
              <Link to="#" className={`${styles.navLink} `}>
                Library
              </Link>
            </li>
            <li className={styles.navItem}>
              <Link to="/settings" className={styles.navLink}>
                Settings
              </Link>
            </li>
          </ul>
        </div>

        {/* Sección Derecha: Botones de Acción */}
        <div className={styles.navRight}>
          <button className={styles.supportButton}>Soporte 24/7</button>
          <button className={styles.discordButton}>Únete a Discord</button>
        </div>
      </div>
    </nav>
  );
};

export default NavbarUsers;
