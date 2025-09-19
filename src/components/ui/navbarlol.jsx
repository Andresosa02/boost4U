import React from "react";
import { Link } from "react-router-dom";
import styles from "./Navbar.module.css";

export const Navbarlol = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.navContainer}>
        {/* Sección Izquierda: Logo y Enlaces */}
        <div className={styles.navLeft}>
          <img
            src="https://cdn.gameboost.com/games/logos/league-of-legends.png"
            alt="Logo de League of Legends"
            className={styles.logo}
          />
          <Link className={styles.titulo} to="/lol">
            league of legends
          </Link>
        </div>
        <div className={styles.navLinks}>
          <ul className={styles.navList}>
            <li className={styles.navItem}>
              <Link to="/boosting" className={styles.navLink}>
                Boosting
              </Link>
            </li>
            <li className={styles.navItem}>
              <Link to="/cuentaslol" className={`${styles.navLink} `}>
                Cuentas
              </Link>
            </li>
            <li className={styles.navItem}>
              <Link to="#" className={styles.navLink}>
                Smurfs hechos a mano
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

export default Navbarlol;
