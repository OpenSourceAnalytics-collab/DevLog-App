/**
 * Global error handling middleware
 */

export const errorHandler = (err, req, res, next) => {
  // Log error details server-side only
  console.error('Error:', {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    path: req.path,
    method: req.method,
  });

  // Don't leak error details in production
  const isDevelopment = process.env.NODE_ENV === 'development';

  // Handle validation errors
  if (err.name === 'ValidationError' || err.status === 400) {
    return res.status(400).json({
      error: 'Validation Error',
      message: isDevelopment ? err.message : 'Invalid input provided',
    });
  }

  // Handle not found errors
  if (err.status === 404) {
    return res.status(404).json({
      error: 'Not Found',
      message: isDevelopment ? err.message : 'Resource not found',
    });
  }

  // Handle rate limit errors
  if (err.status === 429) {
    return res.status(429).json({
      error: 'Too Many Requests',
      message: 'Rate limit exceeded. Please try again later.',
    });
  }

  // Default to 500 server error
  res.status(err.status || 500).json({
    error: 'Internal Server Error',
    message: isDevelopment ? err.message : 'An error occurred processing your request',
  });
};
