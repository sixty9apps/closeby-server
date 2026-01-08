const serverless = require('serverless-http');
const app = require('../../src/app');

const handler = serverless(app);

module.exports.handler = async (event, context) => {
  // you can do other things here
  const result = await handler(event, context);
  return result;
};