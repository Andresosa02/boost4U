// hooks/useProfile.js
import { useState, useEffect } from 'react'
import supabase from '../../supabaseClient'

export const useProfile = () => {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [user, setUser] = useState(null)

  // Obtener perfil del usuario
  const fetchProfile = async (userId) => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error && error.code !== 'PGRST116') {
        throw error
      }

      if (data) {
        setProfile(data)
      } else {
        // Si no existe perfil, crear uno básico
        await createProfile(userId)
      }
    } catch (error) {
      console.error('Error fetching profile:', error.message)
    } finally {
      setLoading(false)
    }
  }

  // Crear perfil básico
  const createProfile = async (userId) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      const newProfile = {
        id: userId,
        full_name: user?.user_metadata?.full_name || user?.user_metadata?.name || '',
        avatar_url: user?.user_metadata?.avatar_url || user?.user_metadata?.picture || null,
        username: null
      }

      const { data, error } = await supabase
        .from('profiles')
        .insert([newProfile])
        .select()
        .single()

      if (error) throw error
      setProfile(data)
    } catch (error) {
      console.error('Error creating profile:', error.message)
    }
  }

  // Actualizar perfil
  const updateProfile = async (updates) => {
    try {
      setUpdating(true)
      
      const { data, error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)
        .select()
        .single()

      if (error) throw error
      
      setProfile(data)
      return { success: true, data }
    } catch (error) {
      console.error('Error updating profile:', error.message)
      return { success: false, error: error.message }
    } finally {
      setUpdating(false)
    }
  }

  // Subir imagen de avatar
  const uploadAvatar = async (file) => {
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}-${Math.random()}.${fileExt}`
      const filePath = `avatars/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

      return { success: true, url: data.publicUrl }
    } catch (error) {
      console.error('Error uploading avatar:', error.message)
      return { success: false, error: error.message }
    }
  }

  useEffect(() => {
    // Obtener usuario actual y su perfil
    const getInitialData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUser(user)
        await fetchProfile(user.id)
      } else {
        setLoading(false)
      }
    }

    getInitialData()

    // Escuchar cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user)
          await fetchProfile(session.user.id)
        } else {
          setUser(null)
          setProfile(null)
          setLoading(false)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  return {
    profile,
    user,
    loading,
    updating,
    updateProfile,
    uploadAvatar,
    refetchProfile: () => user && fetchProfile(user.id)
  }
}