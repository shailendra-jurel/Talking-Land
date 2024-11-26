import React, { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
} from '@mui/material'
import { useDispatch } from 'react-redux'
import { addStory } from '../../features/stories/storiesSlice'
import { toast } from 'react-toastify'

const AddStoryDialog = ({ open, onClose, location }) => {
  const dispatch = useDispatch()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: null,
  })
  const [imagePreview, setImagePreview] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file,
      }))
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const storyData = new FormData()
      storyData.append('title', formData.title.trim())
      storyData.append('description', formData.description.trim())
      if (formData.image) {
        storyData.append('image', formData.image)
      }
      if (location) {
        storyData.append('latitude', location.lat.toString())
        storyData.append('longitude', location.lng.toString())
      }

      // Log form data for debugging
      for (let pair of storyData.entries()) {
        console.log(pair[0] + ': ' + pair[1])
      }

      await dispatch(addStory(storyData)).unwrap()
      toast.success('Story added successfully!')
      handleClose()
    } catch (error) {
      console.error('Failed to add story:', error)
      toast.error(error.message || 'Failed to add story')
    }
  }

  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      image: null,
    })
    setImagePreview(null)
    onClose()
  }

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle>Add New Story</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
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
              multiline
              rows={4}
              required
              fullWidth
            />
            <input
              accept="image/*"
              type="file"
              id="image-upload"
              style={{ display: 'none' }}
              onChange={handleImageChange}
              required
            />
            <label htmlFor="image-upload">
              <Button variant="outlined" component="span">
                {formData.image ? 'Change Image' : 'Upload Image'}
              </Button>
            </label>
            {imagePreview && (
              <Box mt={2}>
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  style={{ 
                    maxWidth: '100%', 
                    maxHeight: '200px',
                    objectFit: 'cover',
                    borderRadius: '4px'
                  }} 
                />
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
            disabled={!formData.title.trim() || !formData.description.trim() || !formData.image}
          >
            Add Story
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default AddStoryDialog