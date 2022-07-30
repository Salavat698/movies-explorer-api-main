const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const { isEmail } = require('validator');
const BadRequestError = require('../errors/BadRequestError');
const UnauthorizedError = require('../errors/UnauthorizedError');

const {
  wrongEmail,
  nameLengthErr,
  badEmailOrPass,
  pathMissing,
} = require('../utils/constants');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    validate(v) {
      if (v.length < 2 || v.length > 30) {
        throw nameLengthErr;
      }
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate(v) {
      if (!isEmail(v)) {
        throw wrongEmail;
      }
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
}, { versionKey: false });

userSchema.statics.findUserByCredentials = function (email, password) {
  if (!email) {
    return new BadRequestError(`${pathMissing} "email".`);
  } if (!password) {
    return new BadRequestError(`${pathMissing} "password".`);
  }
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new UnauthorizedError(badEmailOrPass));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new UnauthorizedError(badEmailOrPass));
          }
          return user;
        });
    });
};

function toJSON() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
}

userSchema.methods.toJSON = toJSON;

module.exports = mongoose.model('user', userSchema);
