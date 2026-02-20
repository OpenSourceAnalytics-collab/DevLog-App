/**
 * Request logging middleware for security monitoring
 */

export const requestLogger = (req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const logData = {
      method: req.method,
      path: req.path,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.get('user-agent'),
      timestamp: new Date().toISOString(),
    };

    // Log suspicious requests
    if (res.statusCode >= 400) {
      console.warn('Request warning:', logData);
    } else {
      console.log('Request:', logData);
    }
  });

  next();
};
