const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const bookValidation = require('../../validations/book.validation');
const bookController = require('../../controllers/book.controller');

const router = express.Router();

router
  .route('/')
  .post(validate(bookValidation.createBook), bookController.createBook)
  .get(validate(bookValidation.getBooks), bookController.getBooks);

router
  .route('/:bookId')
  .get(validate(bookValidation.getBook), bookController.getBook)
  .patch(validate(bookValidation.updateBook), bookController.updateBook)
  .delete(validate(bookValidation.deleteBook), bookController.deleteBook);

router
  .route('/genre/:genre')
  .get(validate(bookValidation.getBooksByGenre), bookController.getBooksByGenre);

router
  .route('/age-group/:ageGroup')
  .get(validate(bookValidation.getBooksByAgeGroup), bookController.getBooksByAgeGroup);

module.exports = router;
