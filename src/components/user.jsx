import { Link } from "react-router-dom";
import supabase from "../supabaseClient";
import React, { useState, useEffect, useRef } from "react";
import { getUserRole } from "../utils/roles";
import "../pages/dashboard/style/Dashboard.css";

export const User = () => {
  const [username, setUsername] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const menuRef = useRef(null);

  const getAvatarUrl = (url) => {
    if (!url) return "";
    // Si ya es una URL completa (Google, etc.), usarla directamente
    if (url.startsWith("http")) return url;
    // Si es una ruta de Supabase Storage, obtener la URL pública
    const storagePath = url.startsWith("Avatars/")
      ? url.replace("Avatars/", "")
      : url;
    const {
      data: { publicUrl },
    } = supabase.storage.from("Avatars").getPublicUrl(storagePath);
    return publicUrl;
  };

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
            .select(`full_name, username, avatar_url`)
            .eq("id", user.id)
            .single();

          if (error && status !== 406) {
            throw error;
          }

          if (data) {
            setUsername(data.username || data.full_name);
            setProfilePicture(getAvatarUrl(data.avatar_url));
          }
        }
      } catch (error) {
        console.error("Error al obtener el perfil:", error.message);
      }
    };

    getUser();

    // Obtener rol del usuario
    const getRole = async () => {
      // Verificar si las tablas existen

      const role = await getUserRole();
      setUserRole(role);
    };
    getRole();

    // Cerrar el menú al hacer clic fuera
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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
    <div className="dashboard-user-dropdown" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="dashboard-user-trigger"
      >
        <img
          src={profilePicture || "https://placehold.co/80x80?text=User"}
          alt="Foto de perfil"
          className="dashboard-user-avatar"
          referrerPolicy="no-referrer"
          onError={(e) => {
            e.currentTarget.src = "https://placehold.co/80x80?text=User";
          }}
        />
      </button>
      {isOpen && (
        <div className="dashboard-user-menu">
          <div className="dashboard-user-card">
            <div className="">
              <img
                src={profilePicture || "https://placehold.co/90x90?text=User"}
                alt="Foto de perfil"
                className="dashboard-user-initial"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.src = "https://placehold.co/90x90?text=User";
                }}
              />
            </div>
            <div className="dashboard-user-info">
              <div className="dashboard-user-name">{username || "Usuario"}</div>
            </div>
          </div>
          <div className="dashboard-user-menu-items">
            <Link
              to="/orders"
              className="dashboard-user-menu-item"
              onClick={() => setIsOpen(false)}
            >
              <span>Dashboard</span>
            </Link>
            <Link
              to="/library"
              className="dashboard-user-menu-item"
              onClick={() => setIsOpen(false)}
            >
              <span>Library</span>
            </Link>
            <Link
              to="/settings"
              className="dashboard-user-menu-item"
              onClick={() => setIsOpen(false)}
            >
              <span>Settings</span>
            </Link>
            <Link
              to="/sales"
              className="dashboard-user-menu-item"
              onClick={() => setIsOpen(false)}
            >
              <span>Sales</span>
            </Link>
            {userRole === "admin" && (
              <Link
                to="/admin"
                className="dashboard-user-menu-item"
                onClick={() => setIsOpen(false)}
              >
                <span>Admin Panel</span>
              </Link>
            )}
          </div>
          <div className="dashboard-user-menu-footer">
            <Link to="/">
              <button
                className="dashboard-user-menu-item dashboard-danger"
                onClick={cerrarSesion}
                type="button"
              >
                <span>Logout</span>
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default User;
