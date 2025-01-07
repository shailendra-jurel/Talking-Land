// store/index.js
import { configureStore } from '@reduxjs/toolkit'
import storiesReducer from './storiesSlice'
import mapReducer from './mapSlice'

export const store = configureStore({
  reducer: {
    stories: storiesReducer,
    map: mapReducer,
  },
})