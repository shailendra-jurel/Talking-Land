import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import logger from '../utils/logger.js'; // Assuming a logger utility exists

// Load environment variables
dotenv.config();

// Cloudinary configuration function with robust error handling
const configureCloudinary = () => {
  // Required environment variables for Cloudinary
  const requiredEnvVars = [
    'CLOUDINARY_CLOUD_NAME',
    'CLOUDINARY_API_KEY',
    'CLOUDINARY_API_SECRET'
  ];

  // Check for missing environment variables
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

  if (missingVars.length > 0) {
    logger.error(`Missing Cloudinary configuration: ${missingVars.join(', ')}`);
    throw new Error(`Missing Cloudinary environment variables: ${missingVars.join(', ')}`);
  }

  try {
    // Configure Cloudinary with environment variables
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    logger.info('Cloudinary configured successfully');
  } catch (error) {
    logger.error('Failed to configure Cloudinary', error);
    throw error;
  }

  return cloudinary;
};

// Export configured Cloudinary instance
export default configureCloudinary();