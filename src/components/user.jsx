import { Link } from "react-router-dom";
import supabase from "../supabaseClient";
import React, { useState, useEffect } from "react";
import "../styles/Dashboard.css";

export const User = () => {
  const [user, setUser] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Obtener usuario actual
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        // La foto de perfil está en user_metadata
        setProfilePicture(
          user.user_metadata?.avatar_url || user.user_metadata?.picture
        );
      }
    };

    getUser();

    // Escuchar cambios de autenticación
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session.user);
        setProfilePicture(
          session.user.user_metadata?.avatar_url ||
            session.user.user_metadata?.picture
        );
      } else {
        setUser(null);
        setProfilePicture(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);
  const cerrarSesion = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div onClick={() => setIsOpen(!isOpen)} className="fotoPerfil">
        <img src={profilePicture} alt="Foto de perfil" className="logo" />
      </div>
      {isOpen && (
        <div>
          {user?.user_metadata?.full_name || user?.user_metadata?.name}
          <Link to="/">
            <button onClick={cerrarSesion}>salir</button>
          </Link>
          <Link to="/settings">
            <button>settings</button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default User;
