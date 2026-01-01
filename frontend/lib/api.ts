import axios from 'axios'

// Get API base URL from environment variable
// For production: https://deadstock-management-portal-wzlp.onrender.com
// For local: http://localhost:8000
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
})

export default api

