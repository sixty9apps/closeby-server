const express = require('express');
const bookRoute = require('./book.route');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/book',
    route: bookRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
