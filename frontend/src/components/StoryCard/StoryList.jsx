import React from 'react'
import { Box, Typography, Paper } from '@mui/material'
import { useSelector } from 'react-redux'
import StoryCard from './StoryCard'
import LoadingSpinner from '../../utils/LoadingSpinner'
import ErrorAlert from '../../utils/ErrorAlert'

const StoryList = () => {
  const { items: stories, status, error } = useSelector((state) => state.stories)

  if (status === 'loading') {
    return <LoadingSpinner />
  }

  if (status === 'failed') {
    return <ErrorAlert message={error || 'Failed to load stories'} />
  }

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 2, 
        overflowY: 'auto', 
        maxHeight: '70vh',
        backgroundColor: 'rgba(255, 255, 255, 0.9)'
      }}
    >
      <Typography variant="h6" gutterBottom>
        Stories
      </Typography>
      {stories.length === 0 ? (
        <Typography color="text.secondary">
          No stories yet. Click on the map to add one!
        </Typography>
      ) : (
        stories.map((story) => (
          <StoryCard key={story._id} story={story} />
        ))
      )}
    </Paper>
  )
}

export default StoryList