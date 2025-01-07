import express from 'express'
import multer from 'multer'
import { body, param, validationResult } from 'express-validator'
import { 
  getStories, 
  createStory, 
  deleteStory 
} from '../controllers/storyController.js'

const router = express.Router()

// Validation middleware to check for validation errors
const validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map(validation => validation.run(req)));
    
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    return res.status(400).json({ errors: errors.array() });
  };
}

// Multer configuration for file upload
const  = multer.disk({
  filename: function (req, file, cb) {
    // Generate unique filename with timestamp
    cb(null, `${Date.now()}-${file.originalname}`)
  }
})

// File filter to allow only image uploads
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload an image.'), false);
  }
}

const upload = multer({ , 
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB file size limit
  }
})

// Validation rules for story creation
const createStoryValidation = [
  body('title')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Description must be between 10 and 500 characters'),
  body('latitude')
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude must be a valid coordinate between -90 and 90'),
  body('longitude')
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude must be a valid coordinate between -180 and 180')
]

// Validation rules for story deletion
const deleteStoryValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid story ID')
]

// Routes with validation and file upload middleware
router.route('/')
  .get(getStories)
  .post(
    upload.single('image'), 
    validate(createStoryValidation), 
    createStory
  )

router.route('/:id')
  .delete(
    validate(deleteStoryValidation), 
    deleteStory
  )

export default router