import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { storyApi } from '../../services/api'
import { toast } from 'react-toastify'

export const fetchStories = createAsyncThunk(
  'stories/fetchStories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await storyApi.getAll()
      return response.data
    } catch (error) {
      toast.error('Failed to fetch stories')
      return rejectWithValue(error.response.data)
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
      return rejectWithValue(error.response.data)
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
      return rejectWithValue(error.response.data)
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
      .addCase(addStory.fulfilled, (state, action) => {
        state.items.unshift(action.payload)
      })
      .addCase(deleteStory.fulfilled, (state, action) => {
        state.items = state.items.filter(story => story._id !== action.payload)
      })
  },
})

export default storiesSlice.reducer