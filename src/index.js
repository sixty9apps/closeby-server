const mongoose = require('mongoose');
const app = require('./app');
const config = require('./config/config');
const logger = require('./config/logger');

let isConnected = false;

// Function to connect to MongoDB
async function connectToDatabase() {
  if (isConnected) {
    return;
  }
  
  try {
    await mongoose.connect(config.mongoose.url, config.mongoose.options);
    isConnected = true;
    logger.info('Connected to MongoDB');
  } catch (error) {
    logger.error('Error connecting to MongoDB:', error);
    throw error;
  }
}

// For development (when running locally)
if (process.env.NODE_ENV !== 'production') {
  let server;
  connectToDatabase().then(() => {
    server = app.listen(config.port, () => {
      logger.info(`Listening to port ${config.port}`);
    });
  });

  const exitHandler = () => {
    if (server) {
      server.close(() => {
        logger.info('Server closed');
        process.exit(1);
      });
    } else {
      process.exit(1);
    }
  };

  const unexpectedErrorHandler = (error) => {
    logger.error(error);
    exitHandler();
  };

  process.on('uncaughtException', unexpectedErrorHandler);
  process.on('unhandledRejection', unexpectedErrorHandler);

  process.on('SIGTERM', () => {
    logger.info('SIGTERM received');
    if (server) {
      server.close();
    }
  });
}

// For production (Vercel serverless)
module.exports = async (req, res) => {
  await connectToDatabase();
  return app(req, res);
};
