const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require('../errors/ConflictError');

const {
  usersIdMissing,
  emailTaken,
  pathMissing,
  badValue,
} = require('../utils/constants');
const { devSecretKey } = require('../utils/config');

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user)
    .orFail(new NotFoundError(usersIdMissing))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError(badValue));
        return;
      }
      next(err);
    });
};

module.exports.updateProfile = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, email }, { runValidators: true, new: true })
    .orFail(new NotFoundError(usersIdMissing))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.code === 11000) {
        return next(new ConflictError(emailTaken));
      } if (err.errors.email) {
        return next(new BadRequestError(err.errors.email.reason));
      } if (err.errors.name) {
        return next(new BadRequestError(err.errors.name.reason));
      }
      return next(err);
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  if (!password) {
    throw next(new BadRequestError(`${pathMissing} 'password'.`));
  }
  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        name, email, password: hash,
      })
        .then((user) => res.send(user))
        .catch((err) => {
          if (err.message.includes('is required')) {
            const pathName = err.message.split('`')[1];
            return next(new BadRequestError(`${pathMissing} '${pathName}'.`));
          } if (err.code === 11000 || err.name === 'MongoError') {
            return next(new ConflictError(emailTaken));
          }
          return next(err);
        });
    }).catch((err) => next(err));
};

module.exports.login = (req, res, next) => {
  const { password, email } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, devSecretKey, { expiresIn: '7d' });
      res.cookie('_id', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        sameSite: 'None',
        secure: true,
      }).send(user);
    })
    .catch((err) => {
      if (err.message.includes('is required')) {
        const pathName = err.message.split('`')[1];
        return next(new BadRequestError(`${pathMissing} '${pathName}'.`));
      }
      return next(err);
    });
};

module.exports.signOut = (req, res, next) => {
  res.clearCookie('_id', {
    sameSite: 'None',
    secure: true,
  }).send({ message: 'Куки удалены' });
  next();
};
