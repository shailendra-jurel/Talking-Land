import React, { useCallback, useEffect } from 'react'
import { GoogleMap, useLoadScript, Marker } from '@google-maps/api'
import { useSelector, useDispatch } from 'react-redux'
import { Box, CircularProgress } from '@mui/material'
import { setSelectedLocation } from '../../features/map/mapSlice'
import { addStory } from '../../features/stories/storiesSlice'
import AddStoryDialog from './AddStoryDialog'

const libraries = ['places']
const mapContainerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '8px',
}

const Map = () => {
  const dispatch = useDispatch()
  const { center, zoom, selectedLocation } = useSelector((state) => state.map)
  const stories = useSelector((state) => state.stories.items)
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [clickedLocation, setClickedLocation] = React.useState(null)

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  })

  const handleMapClick = useCallback((event) => {
    const newLocation = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    }
    setClickedLocation(newLocation)
    setIsDialogOpen(true)
  }, [])

  if (loadError) return <div>Error loading maps</div>
  if (!isLoaded) return <CircularProgress />

  return (
    <Box sx={{ height: '100%', position: 'relative' }}>
        
<GoogleMap
mapContainerStyle={mapContainerStyle}
zoom={zoom}
center={center}
onClick={handleMapClick}
options={{
streetViewControl: false,
mapTypeControl: false,
}}
>
{/* // Update the Marker rendering in the Map component */}
{stories.map((story) => (
  <motion.div
    key={story._id}
    initial={{ scale: 0 }}
    animate={{ scale: 1 }}
    exit={{ scale: 0 }}
  >
    <Marker
      position={{ lat: story.latitude, lng: story.longitude }}
      onClick={() => dispatch(setSelectedLocation(story))}
      animation={selectedLocation?._id === story._id ? 2 : 0}
    />
  </motion.div>
))}



</GoogleMap>
<AddStoryDialog
open={isDialogOpen}
onClose={() => setIsDialogOpen(false)}
location={clickedLocation}
onSubmit={(storyData) => {
dispatch(addStory(storyData))
setIsDialogOpen(false)
}}
/>
</Box>
)
}
export default Map