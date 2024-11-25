import React from 'react'
import {
Card,
CardContent,
CardMedia,
Typography,
CardActions,
Button,
Box,
} from '@mui/material'
import { useDispatch } from 'react-redux'
import { setCenter, setSelectedLocation } from '../../features/map/mapSlice'
import { deleteStory } from '../../features/stories/storiesSlice'
const StoryCard = ({ story }) => {
const dispatch = useDispatch()
const handleCardClick = () => {
dispatch(setCenter({ lat: story.latitude, lng: story.longitude }))
dispatch(setSelectedLocation(story))
}
const handleDelete = (e) => {
e.stopPropagation()
dispatch(deleteStory(story.id))
}
return (
// Update the Card component styling
<Card
  component={motion.div}
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
  sx={{
    mb: 2,
    cursor: 'pointer',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(10px)',
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
      boxShadow: (theme) => theme.shadows[10],
    },
  }}
  onClick={handleCardClick}
>
<CardMedia
component="img"
height="140"
image={story.imageUrl}
alt={story.title}
/>
<CardContent>
<Typography variant="h6" component="div">
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