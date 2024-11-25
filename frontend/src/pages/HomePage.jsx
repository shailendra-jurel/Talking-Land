import React, { useEffect } from 'react'
import { Box, Grid } from '@mui/material'
import { useDispatch } from 'react-redux'
import { fetchStories } from '../features/stories/storiesSlice'
import Map from '../components/Map/Map'
import StoryList from '../components/StoryCard/StoryList'

const HomePage = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchStories())
  }, [dispatch])

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={8}>
        <Box sx={{ height: '70vh' }}>
          <Map />
        </Box>
      </Grid>
      <Grid item xs={12} md={4}>
        <StoryList />
      </Grid>
    </Grid>
  )
}

export default HomePage