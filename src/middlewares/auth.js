const httpStatus = require('http-status');
const config = require('../config/config');
const ApiError = require('../utils/ApiError');

const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return next(new ApiError(httpStatus.status.UNAUTHORIZED, 'Authorization header is required'));
  }

  if (!authHeader.startsWith('Bearer ')) {
    return next(new ApiError(httpStatus.status.UNAUTHORIZED, 'Authorization header must be Bearer token'));
  }

  const token = authHeader.substring(7); // Remove 'Bearer ' prefix

  if (!token) {
    return next(new ApiError(httpStatus.status.UNAUTHORIZED, 'Token is required'));
  }

  if (token !== config.apiKey) {
    return next(new ApiError(httpStatus.status.UNAUTHORIZED, 'Invalid API key'));
  }

  next();
};

module.exports = auth;