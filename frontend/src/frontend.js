// src/App.jsx
import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { ToastContainer } from 'react-toastify'
import Routes from './routes'  // Changed from './pages/AppRoutes'
import { store } from './store'  // Changed from './index'
import theme from './theme'
import 'react-toastify/dist/ReactToastify.css'

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <Routes />
          <ToastContainer position="top-right" autoClose={3000} />
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  )
}
export default App

// src/index.js
import { configureStore } from '@reduxjs/toolkit'
import storiesReducer from '../features/stories/storiesSlice'
import mapReducer from '../features/map/mapSlice'

export const store = configureStore({
  reducer: {
    stories: storiesReducer,
    map: mapReducer,
  },
})

// theme.js
import { createTheme } from '@mui/material/styles'
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
})
export default theme


//package.json
{
    "name": "frontend",
    "private": true,
    "version": "0.0.0",
    "type": "module",
    "scripts": {
      "dev": "vite",
      "build": "vite build",
      "lint": "eslint .",
      "preview": "vite preview"
    },
    "dependencies": {
      "@emotion/react": "^11.13.5",
      "@emotion/styled": "^11.13.5",
      "@mui/icons-material": "^6.1.8",
      "@mui/material": "^6.1.8",
      "@react-google-maps/api": "^2.20.3",
      "@reduxjs/toolkit": "^2.3.0",
      "axios": "^1.7.7",
      "lodash": "^4.17.21",
      "react": "^18.3.1",
      "react-dom": "^18.3.1",
      "react-redux": "^9.1.2",
      "react-router-dom": "^7.0.1",
      "react-toastify": "^10.0.6"
    },
    "devDependencies": {
      "@eslint/js": "^9.13.0",
      "@types/react": "^18.3.12",
      "@types/react-dom": "^18.3.1",
      "@vitejs/plugin-react": "^4.3.3",
      "autoprefixer": "^10.4.20",
      "eslint": "^9.13.0",
      "eslint-plugin-react": "^7.37.2",
      "eslint-plugin-react-hooks": "^5.0.0",
      "eslint-plugin-react-refresh": "^0.4.14",
      "globals": "^15.11.0",
      "postcss": "^8.4.49",
      "tailwindcss": "^3.4.15",
      "vite": "^5.4.10"
    }
  }

// store/index.js
import { configureStore } from '@reduxjs/toolkit'
import storiesReducer from '../features/stories/storiesSlice'
import mapReducer from '../features/map/mapSlice'
export const store = configureStore({
  reducer: {
    stories: storiesReducer,
    map: mapReducer,
  },
})
// utils/ErrorAlert.jsx
import React from 'react'
import { Alert, Box } from '@mui/material'
const ErrorAlert = ({ message }) => {
  return (
    <Box mt={2} mb={2}>
      <Alert severity="error">{message}</Alert>
    </Box>
  )
}
export default ErrorAlert

  // utils/LoadingSpinner.jsx
import React from 'react'
import { Box, CircularProgress } from '@mui/material'
const LoadingSpinner = () => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="200px"
    >
      <CircularProgress />
    </Box>
  )
}
export default LoadingSpinner

// hookes/storiesSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { storyApi } from '../../services/api'
import { toast } from 'react-toastify'

// Async thunks
export const fetchStories = createAsyncThunk(
  'stories/fetchStories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await storyApi.getAll()
      return response.data
    } catch (error) {
      toast.error('Failed to fetch stories')
      return rejectWithValue(error.response?.data || 'Failed to fetch stories')
    }
  }
)
export const addStory = createAsyncThunk(
  'stories/addStory',
  async (storyData, { rejectWithValue }) => {
    try {
      const response = await storyApi.create(storyData)
      toast.success('Story added successfully!')
      return response.data
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to add story'
      toast.error(errorMessage)
      return rejectWithValue(errorMessage)
    }
  }
)
export const deleteStory = createAsyncThunk(
  'stories/deleteStory',
  async (id, { rejectWithValue }) => {
    try {
      await storyApi.delete(id)
      toast.success('Story deleted successfully!')
      return id
    } catch (error) {
      toast.error('Failed to delete story')
      return rejectWithValue(error.response?.data || 'Failed to delete story')
    }
  }
)
// Slice
const storiesSlice = createSlice({
  name: 'stories',
  initialState: {
    items: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch stories
      .addCase(fetchStories.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchStories.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(fetchStories.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })
      // Add story
      .addCase(addStory.fulfilled, (state, action) => {
        state.items.unshift(action.payload)
      })
      // Delete story
      .addCase(deleteStory.fulfilled, (state, action) => {
        state.items = state.items.filter(story => story._id !== action.payload)
      })
  },
})

export default storiesSlice.reducer



// hooks/useMapInteractions.js
import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { setCenter, setZoom, setSelectedLocation } from '../features/map/mapSlice'

export const useMapInteractions = () => {
  const dispatch = useDispatch()

  const handleMarkerClick = useCallback((story) => {
    dispatch(setSelectedLocation(story))
    dispatch(setCenter({ lat: story.latitude, lng: story.longitude }))
    dispatch(setZoom(15))
  }, [dispatch])

  const handleMapClick = useCallback((event) => {
    const newLocation = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    }
    return newLocation
  }, [])

  const resetMapView = useCallback(() => {
    dispatch(setSelectedLocation(null))
    dispatch(setZoom(12))
  }, [dispatch])

  return {
    handleMarkerClick,
    handleMapClick,
    resetMapView,
  }
}
// features/map/mapSlice.js
import { createSlice } from '@reduxjs/toolkit'
const initialState = {
  center: { lat: 40.7128, lng: -74.0060 }, // New York City coordinates
  zoom: 12,
  selectedLocation: null,
}
const mapSlice = createSlice({
  name: 'map',
  initialState,
  reducers: {
    setCenter: (state, action) => {
      state.center = action.payload
    },
    setZoom: (state, action) => {
      state.zoom = action.payload
    },
    setSelectedLocation: (state, action) => {
      state.selectedLocation = action.payload
    },
  },
})
export const { setCenter, setZoom, setSelectedLocation } = mapSlice.actions
export default mapSlice.reducer
// features/stories/storiesSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { storyApi } from '../../services/api'
import { toast } from 'react-toastify'
// Async Thunks
export const fetchStories = createAsyncThunk(
  'stories/fetchStories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await storyApi.getAll()
      return response.data
    } catch (error) {
      toast.error('Failed to fetch stories')
      return rejectWithValue(error.message)
    }
  }
)
export const addStory = createAsyncThunk(
  'stories/addStory',
  async (storyData, { rejectWithValue }) => {
    try {
      const response = await storyApi.create(storyData)
      toast.success('Story added successfully!')
      return response.data
    } catch (error) {
      toast.error('Failed to add story')
      return rejectWithValue(error.message)
    }
  }
)
// Add this new thunk for delete functionality
export const deleteStory = createAsyncThunk(
  'stories/deleteStory',
  async (id, { rejectWithValue }) => {
    try {
      await storyApi.delete(id)
      toast.success('Story deleted successfully!')
      return id
    } catch (error) {
      toast.error('Failed to delete story')
      return rejectWithValue(error.message)
    }
  }
)
const storiesSlice = createSlice({
  name: 'stories',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch stories cases
      .addCase(fetchStories.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchStories.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(fetchStories.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })
      // Add story cases
      .addCase(addStory.fulfilled, (state, action) => {
        state.items.unshift(action.payload)
      })
      // Add these cases for delete functionality
      .addCase(deleteStory.fulfilled, (state, action) => {
        state.items = state.items.filter(story => story._id !== action.payload)
      })
      .addCase(deleteStory.rejected, (state, action) => {
        state.error = action.payload
      })
  },
})
export default storiesSlice.reducer





// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// export const fetchStories = createAsyncThunk(
//   'stories/fetchStories',
//   async () => {
//     const response = await fetch('/api/stories');
//     return response.json();
//   }
// );

// export const addStory = createAsyncThunk(
//   'stories/addStory',
//   async (storyData) => {
//     const response = await fetch('/api/stories', {
//       method: 'POST',
//       body: JSON.stringify(storyData),
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     });
//     return response.json();
//   }
// );

// const storiesSlice = createSlice({
//   name: 'stories',
//   initialState: {
//     items: [],
//     status: 'idle',
//     error: null,
//   },
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchStories.pending, (state) => {
//         state.status = 'loading';
//       })
//       .addCase(fetchStories.fulfilled, (state, action) => {
//         state.status = 'succeeded';
//         state.items = action.payload;
//       })
//       .addCase(fetchStories.rejected, (state, action) => {
//         state.status = 'failed';
//         state.error = action.error.message;
//       });
//   },
// });

// export default storiesSlice.reducer;


// component/Layout/MainLayout.jsx
import React from 'react'
import { Box, Container } from '@mui/material'
import { styled } from '@mui/material/styles'

const MainContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
  backgroundColor: theme.palette.background.default,
}))

const ContentContainer = styled(Container)(({ theme }) => ({
  flex: 1,
  padding: theme.spacing(3),
  display: 'flex',
  flexDirection: 'column',
}))

const MainLayout = ({ children }) => {
  return (
    <MainContainer>
      <ContentContainer maxWidth="xl">
        {children}
      </ContentContainer>
    </MainContainer>
  )
}

export default MainLayout


// component/Map/AddStoryDialog.jsx
import React, { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
} from '@mui/material'
import { useDispatch } from 'react-redux'
import { addStory } from '../../features/stories/storiesSlice'
import { toast } from 'react-toastify'

const AddStoryDialog = ({ open, onClose, location }) => {
  const dispatch = useDispatch()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: null,
  })
  const [imagePreview, setImagePreview] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file,
      }))
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const storyData = new FormData()
      storyData.append('title', formData.title.trim())
      storyData.append('description', formData.description.trim())
      if (formData.image) {
        storyData.append('image', formData.image)
      }
      if (location) {
        storyData.append('latitude', location.lat.toString())
        storyData.append('longitude', location.lng.toString())
      }

      // Log form data for debugging
      for (let pair of storyData.entries()) {
        console.log(pair[0] + ': ' + pair[1])
      }

      await dispatch(addStory(storyData)).unwrap()
      toast.success('Story added successfully!')
      handleClose()
    } catch (error) {
      console.error('Failed to add story:', error)
      toast.error(error.message || 'Failed to add story')
    }
  }

  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      image: null,
    })
    setImagePreview(null)
    onClose()
  }

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle>Add New Story</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              name="title"
              label="Title"
              value={formData.title}
              onChange={handleChange}
              required
              fullWidth
            />
            <TextField
              name="description"
              label="Description"
              value={formData.description}
              onChange={handleChange}
              multiline
              rows={4}
              required
              fullWidth
            />
            <input
              accept="image/*"
              type="file"
              id="image-upload"
              style={{ display: 'none' }}
              onChange={handleImageChange}
              required
            />
            <label htmlFor="image-upload">
              <Button variant="outlined" component="span">
                {formData.image ? 'Change Image' : 'Upload Image'}
              </Button>
            </label>
            {imagePreview && (
              <Box mt={2}>
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  style={{ 
                    maxWidth: '100%', 
                    maxHeight: '200px',
                    objectFit: 'cover',
                    borderRadius: '4px'
                  }} 
                />
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
            disabled={!formData.title.trim() || !formData.description.trim() || !formData.image}
          >
            Add Story
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default AddStoryDialog


// component/Map/Map.jsx
import React, { useState } from 'react'
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api'
import { useSelector, useDispatch } from 'react-redux'
import { Box, CircularProgress } from '@mui/material'
import { setSelectedLocation } from '../../features/map/mapSlice'
import AddStoryDialog from './AddStoryDialog'

const libraries = ['places']

const mapContainerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '8px',
}

const options = {
  disableDefaultUI: true,
  zoomControl: true,
}

const Map = () => {
  const dispatch = useDispatch()
  const { center, zoom } = useSelector((state) => state.map)
  const stories = useSelector((state) => state.stories.items)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [clickedLocation, setClickedLocation] = useState(null)

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ['places'],
  })

  const handleMapClick = (event) => {
    const newLocation = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    }
    setClickedLocation(newLocation)
    setIsDialogOpen(true)
  }

  if (loadError) {
    return <Box>Error loading maps</Box>
  }

  if (!isLoaded) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100%">
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box sx={{ height: '100%', position: 'relative' }}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={zoom}
        center={center}
        options={options}
        onClick={handleMapClick}
      >
        {stories.map((story) => (
          <Marker
            key={story._id}
            position={{ lat: story.latitude, lng: story.longitude }}
            onClick={() => dispatch(setSelectedLocation(story))}
          />
        ))}
      </GoogleMap>
      <AddStoryDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        location={clickedLocation}
      />
    </Box>
  )
}

export default Map



// component/StoryCard/StoryCard.jsx
import React from 'react'
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  CardActions,
  Button,
} from '@mui/material'
import { useDispatch } from 'react-redux'
import { deleteStory } from '../../features/stories/storiesSlice'
import { setCenter, setSelectedLocation } from '../../features/map/mapSlice'

const StoryCard = ({ story }) => {
  const dispatch = useDispatch()

  const handleClick = () => {
    dispatch(setCenter({ lat: story.latitude, lng: story.longitude }))
    dispatch(setSelectedLocation(story))
  }

  const handleDelete = async (e) => {
    e.stopPropagation()
    if (window.confirm('Are you sure you want to delete this story?')) {
      try {
        await dispatch(deleteStory(story._id)).unwrap()
      } catch (error) {
        console.error('Failed to delete story:', error)
      }
    }
  }

  return (
    <Card
      sx={{
        mb: 2,
        cursor: 'pointer',
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'scale(1.02)',
        },
      }}
      onClick={handleClick}
    >
      {story.imageUrl && (
        <CardMedia
          component="img"
          height="140"
          image={story.imageUrl}
          alt={story.title}
        />
      )}
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {story.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {story.description}
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          size="small"
          color="error"
          onClick={handleDelete}
        >
          Delete
        </Button>
      </CardActions>
    </Card>
  )
}

export default StoryCard

// component/StoryCard/StoryList.jsx
import React from 'react'
import { Box, Typography, Paper } from '@mui/material'
import { useSelector } from 'react-redux'
import StoryCard from './StoryCard'
import LoadingSpinner from '../../utils/LoadingSpinner'
import ErrorAlert from '../../utils/ErrorAlert'

const StoryList = () => {
  const { items: stories, status, error } = useSelector((state) => state.stories)

  if (status === 'loading') {
    return <LoadingSpinner />
  }

  if (status === 'failed') {
    return <ErrorAlert message={error || 'Failed to load stories'} />
  }

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 2, 
        overflowY: 'auto', 
        maxHeight: '70vh',
        backgroundColor: 'rgba(255, 255, 255, 0.9)'
      }}
    >
      <Typography variant="h6" gutterBottom>
        Stories
      </Typography>
      {stories.length === 0 ? (
        <Typography color="text.secondary">
          No stories yet. Click on the map to add one!
        </Typography>
      ) : (
        stories.map((story) => (
          <StoryCard key={story._id} story={story} />
        ))
      )}
    </Paper>
  )
}

export default StoryList



// routes/index.jsx
import React from 'react'
import { Routes, Route } from 'react-router-dom'
import MainLayout from '../components/Layout/MainLayout'
import HomePage from '../pages/HomePage'
import NotFound from '../pages/NotFound'

const AppRoutes = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <MainLayout>
            <HomePage />
          </MainLayout>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default AppRoutes



// services/api.js
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
