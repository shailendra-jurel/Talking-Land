import asyncHandler from 'express-async-handler'
import Story from '../models/storyModel.js'
import cloudinary from '../config/cloudinary.js'
import logger from '../utils/logger.js' // Assuming you create a logger utility
import AppError from '../middleware/errorMiddleware.js'

/**
 * @desc    Get all stories sorted by creation date
 * @route   GET /api/stories
 * @access  Public
 */
export const getStories = asyncHandler(async (req, res) => {
  // Implement pagination
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 10
  const skipIndex = (page - 1) * limit

  try {
    const totalStories = await Story.countDocuments()
    const stories = await Story.find({})
      .sort('-createdAt')
      .limit(limit)
      .skip(skipIndex)

    res.json({
      stories,
      currentPage: page,
      totalPages: Math.ceil(totalStories / limit),
      totalStories
    })

    logger.info(`Retrieved ${stories.length} stories`)
  } catch (error) {
    logger.error(`Error retrieving stories: ${error.message}`)
    throw new AppError('Could not retrieve stories', 500)
  }
})

/**
 * @desc    Create a new story
 * @route   POST /api/stories
 * @access  Public
 */
export const createStory = asyncHandler(async (req, res) => {
  const { title, description, latitude, longitude } = req.body

  // Check if file was uploaded
  if (!req.file) {
    throw new AppError('Please upload an image', 400)
  }

  try {
    // Upload image to cloudinary with error handling
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'story_images',
      transformation: [
        { width: 800, height: 600, crop: 'limit' } // Resize large images
      ]
    })

    // Create story with validated and transformed data
    const story = await Story.create({
      title,
      description,
      imageUrl: result.secure_url,
      cloudinaryId: result.public_id,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
    })

    logger.info(`Story created: ${story._id}`)
    res.status(201).json(story)
  } catch (error) {
    logger.error(`Story creation error: ${error.message}`)
    throw new AppError('Could not create story', 500)
  }
})

/**
 * @desc    Delete a story
 * @route   DELETE /api/stories/:id
 * @access  Public
 */
export const deleteStory = asyncHandler(async (req, res) => {
  try {
    const story = await Story.findById(req.params.id)

    if (!story) {
      throw new AppError('Story not found', 404)
    }

    // Delete image from cloudinary
    await cloudinary.uploader.destroy(story.cloudinaryId)

    // Remove story from database
    await Story.deleteOne({ _id: req.params.id })

    logger.info(`Story deleted: ${req.params.id}`)
    res.json({ message: 'Story removed successfully' })
  } catch (error) {
    logger.error(`Story deletion error: ${error.message}`)
    throw new AppError('Could not delete story', 500)
  }
})