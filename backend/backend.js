//backend/package.json
{
    "name": "backend",
    "version": "1.0.0",
    "description": "",
    "main": "index.js",
    "type": "module",
    "scripts": {
     "start": "node server.js" ,
     "dev": "nodemon server.js"
    },
    "keywords": [],
    "author": "",
    "license": "ISC",
    "dependencies": {
      "cloudinary": "^2.5.1",
      "cors": "^2.8.5",
      "dotenv": "^16.4.5",
      "express": "^4.21.1",
      "express-async-handler": "^1.2.0",
      "mongoose": "^8.8.2",
      "morgan": "^1.10.0",
      "multer": "^1.4.5-lts.1"
    }
  }

  // backend/server.js
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import morgan from 'morgan'
import connectDB from './config/db.js'
import storyRoutes from './routes/storyRoutes.js'
import { errorHandler } from './middleware/errorMiddleware.js'

dotenv.config()

const app = express()

// Middleware
app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

// Routes
app.use('/api/stories', storyRoutes)

// Error Handler
app.use(errorHandler)

// Connect to database
connectDB()

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

# backend/.env
PORT=5000
MONGO_URI=mongodb+srv://shailendrajurel001:sj1234@cluster0.1545f.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

NODE_ENV=development

// backend/routes/storyRoutes.js
import express from 'express'
import multer from 'multer'
import { getStories, createStory, deleteStory } from '../controllers/storyController.js'

const router = express.Router()

// Multer configuration
const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString() + '-' + file.originalname)
  }
})

const upload = multer({ storage })

router.route('/')
  .get(getStories)
  .post(upload.single('image'), createStory)

router.route('/:id')
  .delete(deleteStory)

export default router

// backend/routes/storyRoutes.js
import express from 'express'
import multer from 'multer'
import { getStories, createStory, deleteStory } from '../controllers/storyController.js'

const router = express.Router()

// Multer configuration
const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString() + '-' + file.originalname)
  }
})

const upload = multer({ storage })

router.route('/')
  .get(getStories)
  .post(upload.single('image'), createStory)

router.route('/:id')
  .delete(deleteStory)

export default router

// backend/models/storyModel.js
import mongoose from 'mongoose'

const storySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
  cloudinaryId: {
    type: String,
    required: true,
  }
}, {
  timestamps: true
})

const Story = mongoose.model('Story', storySchema)
export default Story

// backend/middleware/errorMiddleware.js
export const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode
    res.status(statusCode)
    res.json({
      message: err.message,
      stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    })
  }

  // backend/controllers/storyController.js
import asyncHandler from 'express-async-handler'
import Story from '../models/storyModel.js'
import cloudinary from '../config/cloudinary.js'

export const getStories = asyncHandler(async (req, res) => {
  const stories = await Story.find({}).sort('-createdAt')
  res.json(stories)
})


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

// backend/config/maps.js
export const GOOGLE_MAPS_LIBRARIES = ['places'];  // Define libraries statically

export const MAP_CONFIG = {
  apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  defaultCenter: {
    lat: 40.7128,
    lng: -74.0060
  },
  defaultZoom: 12
};



// backend/config/db.js
import mongoose from 'mongoose'

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI)
    console.log(`MongoDB Connected: ${conn.connection.host}`)
  } catch (error) {
    console.error(`Error: ${error.message}`)
    process.exit(1)
  }
}

export default connectDB



// backend/cocloudinary.js
import { v2 as cloudinary } from 'cloudinary'
import dotenv from 'dotenv'

dotenv.config()

const requiredEnvVars = [
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET'
];

requiredEnvVars.forEach(varName => {
  if (!process.env[varName]) {
    throw new Error(`Missing required environment variable: ${varName}`);
  }
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary