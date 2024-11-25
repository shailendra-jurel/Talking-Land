import { createSlice } from '@reduxjs/toolkit'

const mapSlice = createSlice({
  name: 'map',
  initialState: {
    center: { lat: 40.7128, lng: -74.0060 }, // Default to NYC
    zoom: 12,
    selectedLocation: null,
  },
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