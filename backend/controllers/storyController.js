import asyncHandler from 'express-async-handler'
import Story from '../models/storyModel.js'
import cloudinary from '../config/cloudinary.js'

// @desc    Get all stories
// @route   GET /api/stories
// @access  Public
export const getStories = asyncHandler(async (req, res) => {
  const stories = await Story.find({}).sort('-createdAt')
  res.json(stories)
})

// @desc    Create a story
// @route   POST /api/stories
// @access  Public
export const createStory = asyncHandler(async (req, res) => {
  const { title, description, latitude, longitude } = req.body

  if (!req.file) {
    res.status(400)
    throw new Error('Please upload an image')
  }

  // Upload image to cloudinary
  const result = await cloudinary.uploader.upload(req.file.path, {
    folder: 'story_images',
  })

  const story = await Story.create({
    title,
    description,
    imageUrl: result.secure_url,
    cloudinaryId: result.public_id,
    latitude: parseFloat(latitude),
    longitude: parseFloat(longitude),
  })

  res.status(201).json(story)
})

// @desc    Delete a story
// @route   DELETE /api/stories/:id
// @access  Public
export const deleteStory = asyncHandler(async (req, res) => {
  const story = await Story.findById(req.params.id)

  if (!story) {
    res.status(404)
    throw new Error('Story not found')
  }

  // Delete image from cloudinary
  await cloudinary.uploader.destroy(story.cloudinaryId)

  await story.remove()
  res.json({ message: 'Story removed' })
})