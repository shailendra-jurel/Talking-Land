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