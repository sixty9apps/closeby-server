const httpStatus = require('http-status');
const pick = require('../utils/pick');
const catchAsync = require('../utils/catchAsync');
const { authorBookService } = require('../services');

const createAuthorBook = catchAsync(async (req, res) => {
  const authorBook = await authorBookService.createAuthorBook(req.body);
  res.status(httpStatus.status.CREATED).send(authorBook);
});

const getAuthorBooks = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'isActive']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await authorBookService.queryAuthorBooks(filter, options);
  res.send(result);
});

module.exports = {
  createAuthorBook,
  getAuthorBooks,
};
