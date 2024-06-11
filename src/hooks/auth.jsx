import { createContext, useContext, useState, useEffect } from "react"
import { api } from '../services/api'

export const AuthContext = createContext({  })

export function AuthProvider({ children }) {
  const [ data, setData ] = useState({})

  async function signIn({ email, password }) {

    try {
      const res = await api.post('/sessions', { email, password })
      const { user, token } = res.data

      localStorage.setItem('@rocketNotes:user', JSON.stringify(user))
      localStorage.setItem('@rocketNotes:token', token)

      api.defaults.headers.common['Authorization'] = `Bearer ${token}`

      setData({ user, token })
    } 
    catch (err) {
      if(err.response){
        alert(err.response.data.message)
      } else {
        alert('❌ Não foi possível efetuar o login')
      }
    }
  }

  function signOut() {
    localStorage.removeItem('@rocketNotes:user')
    localStorage.removeItem('@rocketNotes:token')

    setData({})
  }

  async function updateProfile({ user, avatarFile }) {
   try {
    if(avatarFile) {
      const fileUploadForm = new FormData()
      fileUploadForm.append('avatar', avatarFile)

      const res = await api.patch('/users/avatar', fileUploadForm)
      user.avatar = res.data.avatar
    }

    const { password, ...userData } = user;

    await api.put("/users", user);
    
    // Armazena o objeto "userData" sem a senha no localStorage
    localStorage.setItem("@rocketNotes:user", JSON.stringify(userData));
    
    setData({ user: userData, token: data.token });

    alert('✔️ Perfil atualizado com sucesso!')
   } catch (err) {
    if(err.response){
      alert(err.response.data.message)
    } else {
      alert('❌ Não foi possível atualizar o perfil')
    }
   }
  }

  useEffect(() => {
    const user = localStorage.getItem('@rocketNotes:user')
    const token = localStorage.getItem('@rocketNotes:token')

    if(token && user) {
      api.defaults.headers.common['Authorization']= `Bearer ${token}`


      setData({
        user: JSON.parse(user),
        token,
      })
    }
  }, [])

  return (
    <AuthContext.Provider value={{ 
       signIn,
       signOut,
       updateProfile,
       user: data.user,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext)

  return context
}

