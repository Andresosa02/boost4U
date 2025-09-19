import React from "react";
import { Link } from "react-router-dom";
import styles from "./Navbar.module.css";

export const NavbarFornite = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.navContainer}>
        {/* Sección Izquierda: Logo y Enlaces */}
        <div className={styles.navLeft}>
          <Link to="/fortnite">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/7/7c/Fortnite_F_lettermark_logo.png"
              alt="Logo de Fortnite"
              className={styles.logo}
            />
          </Link>
        </div>
        <div className={styles.navLinks}>
          <ul className={styles.navList}>
            <li className={styles.navItem}>
              <Link to={"/accountsFortnite"} className={`${styles.navLink} `}>
                Cuentas
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

export default NavbarFornite;
