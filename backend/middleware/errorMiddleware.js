import logger from '../utils/logger.js';

// Custom error class for operational errors
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Middleware to handle 404 Not Found errors
export const notFoundHandler = (req, res, next) => {
  const error = new AppError(`Can't find ${req.originalUrl} on this server`, 404);
  next(error);
};

// Central error handling middleware
export const errorHandler = (err, req, res, next) => {
  // Log the error
  logger.error(`Error: ${err.message}`, {
    method: req.method,
    path: req.path,
    stack: err.stack
  });

  // Determine status code
  const statusCode = err.statusCode || 500;

  // Prepare error response
  const errorResponse = {
    status: err.status || 'error',
    message: err.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  };

  // Send error response
  res.status(statusCode).json(errorResponse);
};

// Handle unhandled promise rejections
export const unhandledRejectionHandler = (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  
  // Graceful shutdown
  process.exit(1);
};

// Handle uncaught exceptions
export const uncaughtExceptionHandler = (error) => {
  logger.error('Uncaught Exception:', error);
  
  // Graceful shutdown
  process.exit(1);
};

export default AppError;