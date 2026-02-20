/**
 * Security middleware for request validation and sanitization
 */

export const securityMiddleware = (req, res, next) => {
  // Remove X-Powered-By header
  res.removeHeader('X-Powered-By');

  // Add security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');

  // Validate request size
  const contentLength = req.get('content-length');
  if (contentLength && parseInt(contentLength, 10) > 10240) {
    return res.status(413).json({ error: 'Request entity too large' });
  }

  next();
};
