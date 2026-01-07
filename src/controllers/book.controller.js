const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { bookService } = require('../services');

const createBook = catchAsync(async (req, res) => {
  const book = await bookService.createBook(req.body);
  res.status(httpStatus.status.CREATED).send(book);
});

const getBooks = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['title', 'genre', 'age_group', 'isActive']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await bookService.queryBooks(filter, options);
  res.send(result);
});

const getBook = catchAsync(async (req, res) => {
  const book = await bookService.getBookById(req.params.bookId);
  if (!book) {
    throw new ApiError(httpStatus.status.NOT_FOUND, 'Book not found');
  }
  res.send(book);
});

const getBooksByGenre = catchAsync(async (req, res) => {
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await bookService.getBooksByGenre(req.params.genre, options);
  res.send(result);
});

const getBooksByAgeGroup = catchAsync(async (req, res) => {
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const ageGroup = parseInt(req.params.ageGroup);
  const result = await bookService.getBooksByAgeGroup(ageGroup, options);
  res.send(result);
});

const updateBook = catchAsync(async (req, res) => {
  const book = await bookService.updateBookById(req.params.bookId, req.body);
  res.send(book);
});

const deleteBook = catchAsync(async (req, res) => {
  await bookService.deleteBookById(req.params.bookId);
  res.status(httpStatus.status.NO_CONTENT).send();
});

module.exports = {
  createBook,
  getBooks,
  getBook,
  getBooksByGenre,
  getBooksByAgeGroup,
  updateBook,
  deleteBook,
};
