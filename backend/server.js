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