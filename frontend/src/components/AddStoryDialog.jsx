import React, { useState } from 'react'
import {
Dialog,
DialogTitle,
DialogContent,
DialogActions,
TextField,
Button,
Box,
} from '@mui/material'
const AddStoryDialog = ({ open, onClose, location, onSubmit }) => {
const [formData, setFormData] = useState({
title: '',
description: '',
image: null,
})
const handleChange = (e) => {
const { name, value } = e.target
setFormData((prev) => ({
...prev,
[name]: value,
}))
}
const handleImageChange = (e) => {
const file = e.target.files[0]
setFormData((prev) => ({
...prev,
image: file,
}))
}
const handleSubmit = (e) => {
e.preventDefault()
const storyData = new FormData()
storyData.append('title', formData.title)
storyData.append('description', formData.description)
storyData.append('image', formData.image)
storyData.append('latitude', location.lat)
storyData.append('longitude', location.lng)
onSubmit(storyData)
setFormData({ title: '', description: '', image: null })
}
return (
<Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
<DialogTitle>Add New Story</DialogTitle>
<form onSubmit={handleSubmit}>
<DialogContent>
<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
<TextField
name="title"
label="Title"
value={formData.title}
onChange={handleChange}
required
fullWidth
/>
<TextField
name="description"
label="Description"
value={formData.description}
onChange={handleChange}
required
multiline
rows={4}
fullWidth
/>
<input
accept="image/"
type="file"
onChange={handleImageChange}
style={{ marginTop: '1rem' }}
required
/>
</Box>
</DialogContent>
<DialogActions>
<Button onClick={onClose}>Cancel</Button>
<Button type="submit" variant="contained" color="primary">
Add Story
</Button>
</DialogActions>
</form>
</Dialog>
)
}
export default AddStoryDialog