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