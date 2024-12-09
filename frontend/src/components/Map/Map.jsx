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