const express = require('express');

const rootRouter = express.Router();

const userRoutes = require('./users');
const movieRoutes = require('./movies');

rootRouter.use('/', userRoutes);
rootRouter.use('/', movieRoutes);

module.exports = rootRouter;
