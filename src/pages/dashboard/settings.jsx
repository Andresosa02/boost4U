import React, { useState, useEffect } from "react";
import NavbarUsers from "../../components/ui/navbarUsers";
import supabase from "../../supabaseClient";
import "../../styles/Dashboard.css";

export const Settings = () => {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  const getProfile = async () => {
    try {
      setLoading(true);
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
          setUsername(data.username);
          setAvatarUrl(data.avatar_url);
        }
      }
    } catch (error) {
      console.error("Error al obtener el perfil:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  const updateProfile = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const updates = {
        id: user.id,
        username,
        avatar_url: avatarUrl,
        updated_at: new Date(),
      };

      const { error } = await supabase.from("profiles").upsert(updates); // 'upsert' inserta si no existe, o actualiza si ya existe

      if (error) {
        throw error;
      }
      alert("¡Perfil actualizado con éxito!");
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <NavbarUsers />
      <div className="contenedor">
        <div className="form-widget">
          {loading ? (
            "Cargando perfil..."
          ) : (
            <form onSubmit={updateProfile}>
              <div>
                <label htmlFor="username">Nombre de usuario</label>
                <input
                  id="username"
                  type="text"
                  value={username || ""}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="avatarUrl">URL de la imagen de perfil</label>
                <input
                  id="avatarUrl"
                  type="text"
                  value={avatarUrl || ""}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                />
              </div>
              <div>
                <button type="submit" disabled={loading}>
                  {loading ? "Actualizando..." : "Actualizar perfil"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
