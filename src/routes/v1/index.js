const express = require('express');
const bookRoute = require('./book.route');
const authorBookRoute = require('./authorBook.route');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/book',
    route: bookRoute,
  },
  {
    path: '/author_book',
    route: authorBookRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
