const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError');

function extractBearerToken(header) {
  return header.replace('_id=', '');
}

module.exports = (req, res, next) => {
  const authorization = req.headers.cookie;
  if (!authorization || !authorization.startsWith('_id=')) {
    next(new UnauthorizedError('Авторизуйтесь'));
    return;
  }
  const token = extractBearerToken(authorization);

  let payload;
  try {
    payload = jwt.verify(token, 'super-strong-secret');
  } catch (err) {
    next(new UnauthorizedError('Ошибка авторизации'));
  }
  req.user = payload;
  next();
};
