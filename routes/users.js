const router = require('express').Router();
const auth = require('../middlewares/auth');
const {
  updateProfile,
  getCurrentUser,
  createUser,
  login,
  signOut,
} = require('../controllers/users');
const { createUserValidation, loginValidation } = require('../middlewares/validators');

const { updateProfileValidation } = require('../middlewares/validators');

router.get('/users/me', auth, getCurrentUser);
router.patch('/users/me', auth, updateProfileValidation, updateProfile);
router.post('/signup', createUserValidation, createUser);
router.post('/signin', loginValidation, login);
router.delete('/signout', auth, signOut);

module.exports = router;
