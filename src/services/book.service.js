const httpStatus = require('http-status');
const { Book } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a book
 * @param {Object} bookBody
 * @returns {Promise<Book>}
 */
const createBook = async (bookBody) => {
  if (await Book.isBookTitleTaken(bookBody.title)) {
    throw new ApiError(httpStatus.status.BAD_REQUEST, 'Book title already exists');
  }
  return Book.saveBook(bookBody);
};

/**
 * Query for books
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryBooks = async (filter, options) => {
  return Book.fetchAllBooks(filter, options);
};

/**
 * Get book by id
 * @param {ObjectId} id
 * @returns {Promise<Book>}
 */
const getBookById = async (id) => {
  return Book.fetchBookById(id);
};

/**
 * Get books by genre
 * @param {string} genre
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
const getBooksByGenre = async (genre, options) => {
  return Book.fetchBooksByGenre(genre, options);
};

/**
 * Get books by age group
 * @param {number} ageGroup
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
const getBooksByAgeGroup = async (ageGroup, options) => {
  return Book.fetchBooksByAgeGroup(ageGroup, options);
};

/**
 * Update book by id
 * @param {ObjectId} bookId
 * @param {Object} updateBody
 * @returns {Promise<Book>}
 */
const updateBookById = async (bookId, updateBody) => {
  const book = await getBookById(bookId);
  if (!book) {
    throw new ApiError(httpStatus.status.NOT_FOUND, 'Book not found');
  }
  if (updateBody.title && (await Book.isBookTitleTaken(updateBody.title, bookId))) {
    throw new ApiError(httpStatus.status.status.BAD_REQUEST, 'Book title already exists');
  }
  return Book.updateBook(bookId, updateBody);
};

/**
 * Delete book by id
 * @param {ObjectId} bookId
 * @returns {Promise<Book>}
 */
const deleteBookById = async (bookId) => {
  const book = await getBookById(bookId);
  if (!book) {
    throw new ApiError(httpStatus.status.NOT_FOUND, 'Book not found');
  }
  return Book.deleteBook(bookId);
};

/**
 * Cache a Firebase audio URL on a book for a given narrator voice.
 * No-op if a URL is already set for that voice (first writer wins), unless
 * `replaces` names the exact stale URL being healed.
 * @param {ObjectId} bookId
 * @param {string} voiceId
 * @param {string} audioUrl
 * @param {string} [replaces] - stale URL the client proved unreachable
 * @returns {Promise<Book>}
 */
const setNarratorAudio = async (bookId, voiceId, audioUrl, replaces) => {
  const book = await getBookById(bookId);
  if (!book) {
    throw new ApiError(httpStatus.status.NOT_FOUND, 'Book not found');
  }
  return Book.setNarratorAudio(bookId, voiceId, audioUrl, replaces);
};

module.exports = {
  createBook,
  queryBooks,
  getBookById,
  getBooksByGenre,
  getBooksByAgeGroup,
  updateBookById,
  deleteBookById,
  setNarratorAudio,
};
