const { celebrate, Joi } = require('celebrate');
const { isURL } = require('validator');

const createUserValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  }),
});

const loginValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  }),
});

const updateProfileValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().email().required(),
  }),
});

const getMoviesValidation = celebrate({
  body: Joi.object,
});

const deleteMovieValidation = celebrate({
  params: Joi.object().keys({
    id: Joi.string().length(24).hex(),
  }),
});

const createMovieValidation = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().custom((value, helpers) => {
      if (isURL(value)) {
        return value;
      }
      return helpers.message('Поле "image" заполнено не некорректно.');
    }),
    trailer: Joi.string().required().custom((value, helpers) => {
      if (isURL(value)) {
        return value;
      }
      return helpers.message('Поле "trailer" заполнено не некорректно.');
    }),

    owner: Joi.string().length(24).hex(),
    movieId: Joi.string().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
});

module.exports = {
  createUserValidation,
  loginValidation,
  updateProfileValidation,
  getMoviesValidation,
  deleteMovieValidation,
  createMovieValidation,
};
