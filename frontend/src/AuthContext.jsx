// src/AuthContext.jsx
import { createContext, useContext, useState } from 'react'
import api from './api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]   = useState(() => {
    try { return JSON.parse(localStorage.getItem('auditpath_user')) } catch { return null }
  })
  const [token, setToken] = useState(() => localStorage.getItem('auditpath_token'))

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password })
    localStorage.setItem('auditpath_token', res.data.token)
    localStorage.setItem('auditpath_user', JSON.stringify(res.data.user))
    setToken(res.data.token)
    setUser(res.data.user)
    return res.data
  }

  const register = async (username, email, password) => {
    const res = await api.post('/auth/register', { username, email, password })
    localStorage.setItem('auditpath_token', res.data.token)
    localStorage.setItem('auditpath_user', JSON.stringify(res.data.user))
    setToken(res.data.token)
    setUser(res.data.user)
    return res.data
  }

  const logout = () => {
    localStorage.removeItem('auditpath_token')
    localStorage.removeItem('auditpath_user')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, isAuth: !!token }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
