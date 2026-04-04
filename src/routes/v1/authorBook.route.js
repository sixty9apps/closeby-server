const express = require('express');
const validate = require('../../middlewares/validate');
const authorBookValidation = require('../../validations/authorBook.validation');
const authorBookController = require('../../controllers/authorBook.controller');

const router = express.Router();

router
  .route('/')
  .post(validate(authorBookValidation.createAuthorBook), authorBookController.createAuthorBook)
  .get(validate(authorBookValidation.getAuthorBooks), authorBookController.getAuthorBooks);

module.exports = router;
