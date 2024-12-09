import mongoose from 'mongoose'

// Validation functions
const validateLatitude = (lat) => {
  return lat >= -90 && lat <= 90
}

const validateLongitude = (lng) => {
  return lng >= -180 && lng <= 180
}

const storySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    minlength: [3, 'Title must be at least 3 characters long'],
    maxlength: [100, 'Title must not exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    minlength: [10, 'Description must be at least 10 characters long'],
    maxlength: [500, 'Description must not exceed 500 characters']
  },
  imageUrl: {
    type: String,
    required: [true, 'Image URL is required'],
    validate: {
      validator: function(v) {
        // Basic URL validation
        return /^https?:\/\/.+/.test(v)
      },
      message: 'Invalid image URL'
    }
  },
  latitude: {
    type: Number,
    required: [true, 'Latitude is required'],
    validate: {
      validator: validateLatitude,
      message: 'Invalid latitude. Must be between -90 and 90.'
    }
  },
  longitude: {
    type: Number,
    required: [true, 'Longitude is required'],
    validate: {
      validator: validateLongitude,
      message: 'Invalid longitude. Must be between -180 and 180.'
    }
  },
  cloudinaryId: {
    type: String,
    required: [true, 'Cloudinary ID is required']
  }
}, {
  timestamps: true,
  // Add indexing for improved query performance
  indexes: [
    { fields: { createdAt: -1 } }, // Index for sorting
    { fields: { latitude: 1, longitude: 1 } } // Geospatial index
  ]
})

// Add text index for searchability
storySchema.index({ title: 'text', description: 'text' })

// Pre-save middleware for additional validation or processing
storySchema.pre('save', function(next) {
  // Ensure coordinates are within valid ranges
  if (!validateLatitude(this.latitude)) {
    next(new Error('Invalid latitude'))
  }
  if (!validateLongitude(this.longitude)) {
    next(new Error('Invalid longitude'))
  }
  next()
})

const Story = mongoose.model('Story', storySchema)
export default Story