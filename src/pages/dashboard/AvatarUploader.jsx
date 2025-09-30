import React, { useState, useEffect } from "react";
import supabase from "../../supabaseClient";

export const AvatarUploader = ({ url, onUpload }) => {
  const [avatarUrl, setAvatarUrl] = useState(url);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (url) downloadImage(url);
  }, [url]);

  const downloadImage = async (path) => {
    try {
      // Si la URL ya es una URL completa (Google, etc.), usarla directamente
      if (path.startsWith("http")) {
        setAvatarUrl(path);
        return;
      }

      // Si es una ruta de Supabase Storage, obtener la URL pública
      // La ruta ya no debe incluir 'Avatars/' porque se especifica en .from('Avatars')
      const storagePath = path.startsWith("Avatars/")
        ? path.replace("Avatars/", "")
        : path;

      const {
        data: { publicUrl },
      } = supabase.storage.from("Avatars").getPublicUrl(storagePath);

      setAvatarUrl(publicUrl);
    } catch (error) {
      console.error("Error downloading image: ", error.message);
    }
  };
  // ... (aquí irá la función para subir la imagen)
  const uploadAvatar = async (event) => {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("You must select an image to upload.");
      }

      const file = event.target.files[0];

      // Validar tipo de archivo
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
      ];
      if (!allowedTypes.includes(file.type)) {
        throw new Error(
          "Solo se permiten archivos de imagen (JPEG, PNG, GIF, WebP)"
        );
      }

      // Validar tamaño (5MB máximo)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        throw new Error("El archivo es demasiado grande. Máximo 5MB");
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("No user authenticated");
      }

      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = fileName; // No incluir 'Avatars/' aquí, se especifica en .from('Avatars')

      const { error: uploadError } = await supabase.storage
        .from("Avatars")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        throw uploadError;
      }

      // Obtener la URL pública correcta
      const {
        data: { publicUrl },
      } = supabase.storage.from("Avatars").getPublicUrl(filePath);

      setAvatarUrl(publicUrl);
      onUpload(publicUrl); // Llama a la función prop con la URL pública completa
    } catch (error) {
      console.error("Upload failed:", error);
      alert(`Error al subir la imagen: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ margin: "20px 0" }}>
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt="Avatar"
          className="avatar-image"
          style={{ height: "auto", width: "90px", borderRadius: "50%" }}
        />
      ) : (
        <div
          className="avatar-placeholder"
          style={{
            height: "150px",
            width: "150px",
            backgroundColor: "#ccc",
            borderRadius: "50%",
          }}
        />
      )}
      <div style={{ marginTop: "10px" }}>
        <label className="button primary" htmlFor="single">
          {uploading ? "Subiendo..." : "Subir Imagen"}
        </label>
        <input
          type="file"
          id="single"
          accept="image/*"
          onChange={uploadAvatar}
          disabled={uploading}
          style={{ visibility: "hidden", position: "absolute" }}
        />
      </div>
    </div>
  );
};

export default AvatarUploader;
