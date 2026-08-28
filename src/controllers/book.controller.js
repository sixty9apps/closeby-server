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
  const filter = pick(req.query, ['title', 'genre', 'age_group', 'isActive', 'author_id']);
  // Hide author-owned books from the default list so live 2.1 clients (which
  // expect every returned book to have a populated audio_url) never see ones
  // that ship with empty audio_url awaiting first-play TTS generation. New
  // clients fetch them through /v1/author_book/with-books instead, or via
  // ?include_authored=true here for debugging.
  if (!req.query.include_authored && !filter.author_id) {
    filter.author_id = { $in: [null, ''] };
  }
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await bookService.queryBooks(filter, options);
  res.send(result);
});

const setNarratorAudio = catchAsync(async (req, res) => {
  const { voice_id, audio_url, replaces } = req.body;
  const book = await bookService.setNarratorAudio(req.params.bookId, voice_id, audio_url, replaces);
  res.send(book);
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
  setNarratorAudio,
};
