const httpStatus = require('http-status');
const { AuthorBook, Book } = require('../models');
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

/**
 * Fetch every active author together with their active books, in a single
 * round trip. Used by the iOS "Original Stories by author" Home section so the
 * client doesn't need to N+1 across authors.
 * @returns {Promise<Array<{ author: AuthorBook, books: Array<Book> }>>}
 */
const getAuthorsWithBooks = async () => {
  // Do NOT use .lean() here. The toJSON schema plugin (renames _id → id,
  // strips timestamps/__v) only runs during Mongoose's JSON serialization —
  // and only on documents that still carry the model's toJSON method. iOS
  // clients decode the response by the `id` key, not `_id`.
  const authors = await AuthorBook.find({ isActive: true });
  if (authors.length === 0) return [];

  const authorIds = authors.map((a) => a._id.toString());
  const books = await Book.find({
    isActive: true,
    author_id: { $in: authorIds },
  });

  const booksByAuthor = books.reduce((acc, book) => {
    (acc[book.author_id] = acc[book.author_id] || []).push(book);
    return acc;
  }, {});

  return authors.map((author) => ({
    author,
    books: booksByAuthor[author._id.toString()] || [],
  }));
};

module.exports = {
  createAuthorBook,
  queryAuthorBooks,
  getAuthorBookById,
  getAuthorsWithBooks,
};
