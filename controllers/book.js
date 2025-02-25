const { error } = require('console');
const Book = require('../models/Book');
const fs = require('fs');

exports.getAllBooks = (req, res, next) => {
  Book.find()
    .then((books) => {
      res.status(200).json(books);
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

exports.getOneBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => res.status(200).json(book))
    .catch((error) => res.status(404).json({ error }));
};

exports.createBook = (req, res, next) => {
  console.log('Requête reçue:', req.body);
  const bookObject = JSON.parse(req.body.book);
  console.log(bookObject);

  delete bookObject._id;
  delete bookObject._userId;
  const book = new Book({
    ...bookObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
  });
  book
    .save()
    .then(() => {
      res.status(201).json({ message: 'livre enregistré' });
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

exports.modifyBook = (req, res, next) => {
  const bookObject = req.file
    ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
      }
    : { ...req.body };
  delete bookObject._userId;
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (book.userId != req.auth.userId) {
        res.status(401).json({ message: 'Non autorisé' });
      } else {
        Book.updateOne(
          { _id: req.params.id },
          { ...bookObject, _id: req.params.id }
        )
          .then(() => res.status(200).json({ message: 'livre modifié' }))
          .catch((error) => {
            res.status(401).json({ error });
          });
      }
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

exports.deleteBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (book.userId != req.auth.userId) {
        res.status(401).json({ message: 'Non-autorisé' });
      } else {
        const filename = book.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          Book.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: 'livre supprimé' }))
            .catch((error) => {
              res.status(401).json({ error });
            });
        });
      }
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

// exports.getTopThree = (req, res, next) => {
//   Book.find()
//     .then((books) => {
//       //let sortedBooks = [];
//       //sortedBooks.push(books.averageRating);
//       //  console.log(sortedBooks);
//       res.status(200).json([books]);
//     })
//     .catch((error) => res.status(404).json({ error }));
// };

exports.publishRate = (req, res, next) => {
  console.log(req.params);
  //console.log(req.body.userId);
  //console.log(req.body.rating);
  console.log(req.body);

  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (req.body.userId === book.ratings.userId) {
        res.status(401).json((error) => {
          error;
        });
      } else {
        console.log('consition reach');

        Book.updateOne({ _id: req.params.id }, { ...book, ratings: req.body })
          .then(() => {
            res.status(200).json({ message: 'Note ajouté' });
          })
          .catch((error) => res.status(401).json({ error }));
      }
      // console.log(book.ratings);
    })
    .catch((error) => res.status(400).json({ error }));
};
