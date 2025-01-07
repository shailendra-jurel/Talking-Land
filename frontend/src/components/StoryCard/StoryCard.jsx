// component//StoryCard/StoryCard.jsx
import React from 'react'
import { Card, CardContent, CardMedia, Typography, CardActions, Button,} from '@mui/material'
import { useDispatch } from 'react-redux'
import { deleteStory } from '../../store/storiesSlice'
import { setCenter, setSelectedLocation } from '../../store/mapSlice'

const StoryCard = ({ story }) => {
  const dispatch = useDispatch()

  const handleClick = () => {
    dispatch(setCenter({ lat: story.latitude, lng: story.longitude }))
    dispatch(setSelectedLocation(story))
  }

  const handleDelete = async (e) => {
    e.stopPropagation()
    if (window.confirm('Are you sure you want to delete this story?')) {
      try {
        await dispatch(deleteStory(story._id)).unwrap()
      } catch (error) {
        console.error('Failed to delete story:', error)
      }
    }
  }

  return (
    <Card
      sx={{
        mb: 2,
        cursor: 'pointer',
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'scale(1.02)',
        },
      }}
      onClick={handleClick}
    >
      {story.imageUrl && (
        <CardMedia
          component="img"
          height="140"
          image={story.imageUrl}
          alt={story.title}
        />
      )}
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {story.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {story.description}
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          size="small"
          color="error"
          onClick={handleDelete}
        >
          Delete
        </Button>
      </CardActions>
    </Card>
  )
}

export default StoryCard