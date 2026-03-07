// src/api.js
import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
})

// Attach token to every request
api.interceptors.request.use(config => {
  const token = localStorage.getItem('auditpath_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Handle 401 globally
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('auditpath_token')
      localStorage.removeItem('auditpath_user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default api
