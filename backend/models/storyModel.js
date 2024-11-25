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