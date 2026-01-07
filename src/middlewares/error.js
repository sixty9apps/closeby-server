const mongoose = require('mongoose');
const httpStatus = require('http-status');
const config = require('../config/config');
const logger = require('../config/logger');
const ApiError = require('../utils/ApiError');

const errorConverter = (err, req, res, next) => {
  let error = err;
  if (!(error instanceof ApiError)) {
    const statusCode =
      error.statusCode || (error instanceof mongoose.Error ? httpStatus.status.BAD_REQUEST : httpStatus.status.INTERNAL_SERVER_ERROR);
    const message = error.message || 'An error occurred';
    error = new ApiError(statusCode, message, false);
  }
  next(error);
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || httpStatus.status.INTERNAL_SERVER_ERROR;
  let message = err.message || 'Internal Server Error';

  if (typeof statusCode !== 'number' || !statusCode) {
    statusCode = httpStatus.status.INTERNAL_SERVER_ERROR;
  }

  if (config.env === 'production' && !err.isOperational) {
    statusCode = httpStatus.status.INTERNAL_SERVER_ERROR;
    message = 'Internal Server Error';
  }

  res.locals.errorMessage = err.message;

  const response = {
    code: statusCode,
    message,
    ...(config.env === 'development' && { stack: err.stack }),
  };

  if (config.env === 'development') {
    logger.error(err);
  }

  res.status(statusCode).json(response);
};

module.exports = {
  errorConverter,
  errorHandler,
};
