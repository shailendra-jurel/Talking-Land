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