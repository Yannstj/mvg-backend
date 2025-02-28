const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const sharp = require('../middleware/sharp-middleware');

const bookController = require('../controllers/book');

//GET
router.get('/', bookController.getAllBooks);
router.get('/bestrating', bookController.getTopThree);
//( ordre important /bestrating  avant /:id)
router.get('/:id', bookController.getOneBook);

//POST
router.post('/', auth, multer, sharp, bookController.createBook);
router.post('/:id/rating', auth, bookController.rateBook);
//PUT / DELETE
router.put('/:id', auth, multer, sharp, bookController.modifyBook);
router.delete('/:id', auth, bookController.deleteBook);

module.exports = router;
