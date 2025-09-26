// src/utils/roles.js
import supabase from '../supabaseClient';

export const USER_ROLES = {
  ADMIN: 'admin',
  SELLER: 'seller', 
  USER: 'user'
};

// Función para obtener el rol del usuario actual
export const getUserRole = async () => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return USER_ROLES.USER;

    // Verificar si es admin
    const { data: adminData } = await supabase
      .from("profileAdmins") // a cambiar
      .select('id')
      .eq('id', user.id)
      .single();

    if (adminData) {
      return USER_ROLES.ADMIN;
    }

    // Verificar si es vendedor
    const { data: sellerData } = await supabase
      .from('profileSellers')
      .select('id, is_active')
      .eq('id', user.id)
      .single();

    if (sellerData && sellerData.is_active) {
      return USER_ROLES.SELLER;
    }
    return USER_ROLES.USER;
  } catch (error) {
    console.error('Error getting user role:', error);
    return USER_ROLES.USER;
  }
};

// Función para verificar si el usuario tiene un rol específico
export const hasRole = async (requiredRole) => {
  const userRole = await getUserRole();
  return userRole === requiredRole;
};

// Función para verificar si el usuario es admin
export const isAdmin = async () => {
  return await hasRole(USER_ROLES.ADMIN);
};

// Función para verificar si el usuario es vendedor
export const isSeller = async () => {
  return await hasRole(USER_ROLES.SELLER);
};

// Función para verificar si el usuario es admin o vendedor
export const isAdminOrSeller = async () => {
  const role = await getUserRole();
  return role === USER_ROLES.ADMIN || role === USER_ROLES.SELLER;
};
