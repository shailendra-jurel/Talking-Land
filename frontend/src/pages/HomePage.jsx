// pages/HomePage.jsx
import React from 'react'
import { Box, Grid } from '@mui/material'
import Map from '../components/Map/Map'
import StoryList from '../components/StoryCard/StoryList'

const HomePage = () => {
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