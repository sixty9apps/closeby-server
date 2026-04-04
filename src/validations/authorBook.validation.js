const Joi = require('joi');

const createAuthorBook = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    bio: Joi.string(),
    book_ids: Joi.array().items(Joi.string()),
    isActive: Joi.boolean(),
  }),
};

const getAuthorBooks = {
  query: Joi.object().keys({
    name: Joi.string(),
    isActive: Joi.boolean(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

module.exports = {
  createAuthorBook,
  getAuthorBooks,
};
