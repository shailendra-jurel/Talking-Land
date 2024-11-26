import axios from 'axios'

const BASE_URL = 'http://localhost:5000/api'

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const storyApi = {
  getAll: async () => {
    try {
      const response = await api.get('/stories')
      return response
    } catch (error) {
      throw error
    }
  },

  create: async (storyData) => {
    try {
      const formData = new FormData()
      Object.keys(storyData).forEach(key => {
        formData.append(key, storyData[key])
      })
      const response = await api.post('/stories', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      return response
    } catch (error) {
      throw error
    }
  },

  delete: async (id) => {
    try {
      const response = await api.delete(`/stories/${id}`)
      return response
    } catch (error) {
      throw error
    }
  },
}

export default api