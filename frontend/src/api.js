import axios from 'axios'

const API_BASE_URL = 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
})

export const storyApi = {
  getAll: () => api.get('/stories'),
  create: (formData) => api.post('/stories', formData),
  delete: (id) => api.delete(`/stories/${id}`),
}

export default api