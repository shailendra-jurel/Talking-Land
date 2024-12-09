import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import compression from 'compression';
import dotenv from 'dotenv';
import morgan from 'morgan';
import winston from 'winston'; // Advanced logging

// Local module imports
import connectDB from './config/db.js';
import storyRoutes from './routes/storyRoutes.js';
import { 
  errorHandler, 
  notFoundHandler 
} from './middleware/errorMiddleware.js';
import { validateEnvironment } from './utils/envValidator.js';

// Load environment configuration
dotenv.config();

// Validate and ensure all required environment variables are present
validateEnvironment();

// Create Express application
const app = express();

// Logger configuration
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

// Security Middleware: Set various HTTP headers
app.use(helmet());

// Rate Limiting: Prevent brute-force and DOS attacks
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later'
});
app.use(limiter);

// Compression: Reduce response sizes
app.use(compression());

// CORS Configuration: Control cross-origin resource sharing
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS.split(','),
  methods: ['GET', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body Parsing Middleware
app.use(express.json({ 
  limit: '10kb' // Limit request payload size
}));
app.use(express.urlencoded({ extended: true }));

// HTTP Request Logger
app.use(morgan(
  process.env.NODE_ENV === 'development' ? 'dev' : 'combined'
));

// Routes
app.use('/api/stories', storyRoutes);

// 404 and Error Handling Middleware
app.use(notFoundHandler);
app.use(errorHandler);

// Database Connection
connectDB();

// Server Configuration
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Graceful Shutdown Handling
process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down gracefully');
  server.close(() => {
    logger.info('Process terminated');
    process.exit(0);
  });
});

// Unhandled Promise Rejection Handling
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  server.close(() => process.exit(1));
});

export default app;