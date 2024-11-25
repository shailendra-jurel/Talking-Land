import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const API_URL = 'http://localhost:5000/api/stories'

export const fetchStories = createAsyncThunk(
  'stories/fetchStories',
  async () => {
    const response = await axios.get(API_URL)
    return response.data
  }
)

export const addStory = createAsyncThunk(
  'stories/addStory',
  async (storyData) => {
    const response = await axios.post(API_URL, storyData)
    return response.data
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
        state.error = action.error.message
      })
      .addCase(addStory.fulfilled, (state, action) => {
        state.items.push(action.payload)
      })
  },
})

export default storiesSlice.reducer