import React from 'react'
import { Box, Typography } from '@mui/material'
import { useSelector } from 'react-redux'
import StoryCard from './StoryCard'
const StoryList = () => {
const stories = useSelector((state) => state.stories.items)
const status = useSelector((state) => state.stories.status)
if (status === 'loading') {
return <Typography>Loading stories...</Typography>
}
if (status === 'failed') {
return <Typography color="error">Failed to load stories</Typography>
}
return (
<Box sx={{ overflowY: 'auto', maxHeight: '70vh' }}>
{stories.length === 0 ? (
<Typography>No stories yet. Click on the map to add one!</Typography>
) : (
stories.map((story) => (
<StoryCard key={story.id} story={story} />
))
)}
</Box>
)
}
export default StoryList