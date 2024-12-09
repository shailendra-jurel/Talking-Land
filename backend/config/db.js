import mongoose from 'mongoose';
import logger from '../utils/logger.js';

// MongoDB connection options
const MONGO_OPTIONS = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// Database connection function with robust error handling
const connectDB = async () => {
  try {
    // Validate MongoDB URI
    if (!process.env.MONGO_URI) {
      throw new Error('MongoDB connection string is not defined');
    }

    // Attempt connection
    const conn = await mongoose.connect(process.env.MONGO_URI, MONGO_OPTIONS);

    // Log successful connection
    logger.info(`MongoDB Connected: ${conn.connection.host}`);

    // Additional connection event listeners
    mongoose.connection.on('disconnected', () => {
      logger.warn('Lost MongoDB connection');
    });

    mongoose.connection.on('reconnected', () => {
      logger.info('Reconnected to MongoDB');
    });

    mongoose.connection.on('error', (error) => {
      logger.error('MongoDB connection error:', error);
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      logger.info('MongoDB connection closed through app termination');
      process.exit(0);
    });

    return conn;
  } catch (error) {
    // Detailed error logging
    logger.error(`MongoDB Connection Error: ${error.message}`);
    
    // Exit process with failure
    process.exit(1);
  }
};

export default connectDB;