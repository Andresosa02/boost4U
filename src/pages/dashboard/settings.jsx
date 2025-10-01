import React, { useState, useEffect, useCallback } from "react";
import NavbarUsers from "../../components/ui/navbarUsers";
import supabase from "../../supabaseClient";
import AvatarUploader from "./AvatarUploader";
import "./style/Dashboard.css";

export const Settings = () => {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  // Función para obtener la URL correcta del avatar
  const getAvatarUrl = (url) => {
    if (!url) return "";

    // Si ya es una URL completa (Google, etc.), usarla directamente
    if (url.startsWith("http")) {
      return url;
    }

    // Si es una ruta de Supabase Storage, obtener la URL pública
    // La ruta ya no debe incluir 'Avatars/' porque se especifica en .from('Avatars')
    const storagePath = url.startsWith("Avatars/")
      ? url.replace("Avatars/", "")
      : url;

    const {
      data: { publicUrl },
    } = supabase.storage.from("Avatars").getPublicUrl(storagePath);

    return publicUrl;
  };

  const getProfile = useCallback(async () => {
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
          setAvatarUrl(getAvatarUrl(data.avatar_url));
        }
      }
    } catch (error) {
      console.error("Error al obtener el perfil:", error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getProfile();
  }, [getProfile]);

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
      if (error.code === "23505") {
        // Error de unicidad: el username ya existe
        alert("¡Ese nombre de usuario ya está en uso! Por favor, elige otro.");
      } else {
        alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <NavbarUsers />
      <div className="dashboard-contenedor">
        <div className="dashboard-form-widget">
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
                <label htmlFor="avatarUrl">Imagen de perfil</label>
                <AvatarUploader
                  url={avatarUrl}
                  onUpload={(filePath) => setAvatarUrl(filePath)} // Actualiza el estado con la nueva ruta
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
