const router = require('express').Router();
const auth = require('../middlewares/auth');
const { deleteMovie, createMovie, getMovies } = require('../controllers/movies');
const { getMoviesValidation, deleteMovieValidation, createMovieValidation } = require('../middlewares/validators');

router.delete('/movies/:id', auth, deleteMovieValidation, deleteMovie);
router.post('/movies', auth, createMovieValidation, createMovie);
router.get('/movies', auth, getMoviesValidation, getMovies);

module.exports = router;
