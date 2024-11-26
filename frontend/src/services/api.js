import axios from 'axios'

const BASE_URL = 'http://localhost:5000/api'

// Create axios instance with default config
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    })
    return Promise.reject(error)
  }
)

export const storyApi = {
  getAll: async () => {
    try {
      const response = await api.get('/stories')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch stories')
    }
  },

  create: async (storyData) => {
    try {
      // Ensure we're sending FormData with the correct content type
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }

      // Log the data being sent (for debugging)
      console.log('Sending story data:', {
        title: storyData.get('title'),
        description: storyData.get('description'),
        latitude: storyData.get('latitude'),
        longitude: storyData.get('longitude'),
        hasImage: storyData.get('image') !== null,
      })

      const response = await api.post('/stories', storyData, config)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create story')
    }
  },

  delete: async (id) => {
    try {
      if (!id) {
        throw new Error('Story ID is required')
      }
      const response = await api.delete(`/stories/${id}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete story')
    }
  },

  update: async (id, storyData) => {
    try {
      if (!id) {
        throw new Error('Story ID is required')
      }
      const response = await api.put(`/stories/${id}`, storyData)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update story')
    }
  },

  getById: async (id) => {
    try {
      if (!id) {
        throw new Error('Story ID is required')
      }
      const response = await api.get(`/stories/${id}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch story')
    }
  },
}

// Add request interceptor for error handling
api.interceptors.request.use(
  (config) => {
    // You can add auth tokens here if needed
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`
    // }
    return config
  },
  (error) => {
    console.error('Request Error:', error)
    return Promise.reject(error)
  }
)

export default api