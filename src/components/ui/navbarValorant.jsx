import React from "react";
import { Link } from "react-router-dom";
import styles from "./Navbar.module.css";

export const NavbarValorant = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.navContainer}>
        {/* Sección Izquierda: Logo y Enlaces */}
        <div className={styles.navLeft}>
          <img
            src="https://images.steamusercontent.com/ugc/1009310639741043947/C4780FD7B53B39EFE4A536842FC1281A48A1256F/?imw=268&imh=268&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=true"
            alt="Logo de Valorant"
            className={styles.logo}
          />
          <Link className={styles.titulo} to="/valorant">
            Valorant
          </Link>
        </div>
        <div className={styles.navLinks}>
          <ul className={styles.navList}>
            <li className={styles.navItem}>
              <Link to="/boostingValorant" className={styles.navLink}>
                Boosting
              </Link>
            </li>
            <li className={styles.navItem}>
              <Link to="/cuentasValorant" className={`${styles.navLink} `}>
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

export default NavbarValorant;
