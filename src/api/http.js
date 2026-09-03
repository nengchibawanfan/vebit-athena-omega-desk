import axios from 'axios'

const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 15000
})

http.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

http.interceptors.response.use(
  (response) => {
    const payload = response.data
    if (payload && typeof payload === 'object' && 'data' in payload && ('code' in payload || 'success' in payload)) {
      const ok = payload.success === true || payload.code === 0 || payload.code === 200
      if (!ok) {
        return Promise.reject(new Error(payload.message || payload.msg || '接口返回失败'))
      }
      return payload.data
    }
    return payload
  },
  (error) => {
    const message = error.response?.data?.message || error.message || '网络请求失败'
    return Promise.reject(new Error(message))
  }
)

export default http
