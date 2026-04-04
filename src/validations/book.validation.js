const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createBook = {
  body: Joi.object().keys({
    title: Joi.string().required(),
    summary: Joi.string(),
    content: Joi.string().required(),
    audio_url: Joi.array().items(Joi.string()).required(),
    duration: Joi.number().required(),
    genre: Joi.string().required(),
    age_group: Joi.array().items(Joi.number()).required(),
    highlights: Joi.array().items(Joi.string()).required(),
    cover_image_url: Joi.string().required(),
    author_id: Joi.string(),
    isActive: Joi.boolean()
  }),
};

const getBooks = {
  query: Joi.object().keys({
    title: Joi.string(),
    genre: Joi.string(),
    age_group: Joi.array().items(Joi.number()),
    author_id: Joi.string(),
    isActive: Joi.boolean(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getBook = {
  params: Joi.object().keys({
    bookId: Joi.string().custom(objectId),
  }),
};

const getBooksByGenre = {
  params: Joi.object().keys({
    genre: Joi.string().required(),
  }),
  query: Joi.object().keys({
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getBooksByAgeGroup = {
  params: Joi.object().keys({
    ageGroup: Joi.number().integer().required(),
  }),
  query: Joi.object().keys({
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const updateBook = {
  params: Joi.object().keys({
    bookId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      title: Joi.string(),
      summary: Joi.string(),
      content: Joi.string(),
      audio_url: Joi.array().items(Joi.string()),
      duration: Joi.number(),
      genre: Joi.string(),
      age_group: Joi.array().items(Joi.number()),
      highlights: Joi.array().items(Joi.string()),
      cover_image_url: Joi.string(),
      author_id: Joi.string(),
      isActive: Joi.boolean()
    })
    .min(1),
};

const deleteBook = {
  params: Joi.object().keys({
    bookId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createBook,
  getBooks,
  getBook,
  getBooksByGenre,
  getBooksByAgeGroup,
  updateBook,
  deleteBook,
};