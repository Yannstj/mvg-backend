const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const bookController = require('../controllers/book');

//GET
router.get('/', bookController.getAllBooks);
router.get('/bestrating', bookController.getTopThree);
router.get('/:id', bookController.getOneBook);

//POST
router.post('/', auth, multer, bookController.createBook);
router.post('/:id/rating', auth, bookController.rateBook);
//PUT / DELETE
router.put('/:id', auth, multer, bookController.modifyBook);
router.delete('/:id', auth, multer, bookController.deleteBook);

module.exports = router;
