const httpStatus = require('http-status');
const { AuthorBook } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create an author book
 * @param {Object} authorBookBody
 * @returns {Promise<AuthorBook>}
 */
const createAuthorBook = async (authorBookBody) => {
  if (await AuthorBook.isAuthorNameTaken(authorBookBody.name)) {
    throw new ApiError(httpStatus.status.BAD_REQUEST, 'Author name already exists');
  }
  return AuthorBook.saveAuthorBook(authorBookBody);
};

/**
 * Query for author books
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryAuthorBooks = async (filter, options) => {
  return AuthorBook.fetchAllAuthorBooks(filter, options);
};

/**
 * Get author book by id
 * @param {ObjectId} id
 * @returns {Promise<AuthorBook>}
 */
const getAuthorBookById = async (id) => {
  return AuthorBook.fetchAuthorBookById(id);
};

module.exports = {
  createAuthorBook,
  queryAuthorBooks,
  getAuthorBookById,
};
