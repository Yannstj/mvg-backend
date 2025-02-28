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

exports.rateBook = (req, res, next) => {
  const userId = req.auth.userId;
  const rating = req.body.rating;
  const userRating = { userId, grade: rating };

  Book.findOne({ _id: req.params.id })
    .then((book) => {
      const alreadyRated = book.ratings.find(
        (rating) => rating.userId === userId
      );

      if (alreadyRated) {
        return res.status(409).json({ message: 'Livre déjà évalué' }); // 409 Conflict
      } else {
        book.ratings.push(userRating);

        const totalRatings = book.ratings.reduce(
          (sum, rating) => sum + rating.grade,
          0
        );
        const averageRating = totalRatings / book.ratings.length;

        book.averageRating = Math.round(averageRating);

        return book
          .save()
          .then((updatedBook) => res.status(200).json(updatedBook))
          .catch((error) => res.status(400).json({ error }));
      }
    })
    .catch((error) => res.status(400).json({ error }));
};

exports.getTopThree = (req, res, next) => {
  Book.find()
    .sort({ averageRating: -1 }) // Trie les livres par notation décroissante
    .limit(3) // Limite à 3 livres
    .then((books) => {
      res.status(200).json(books);
    })
    .catch((error) => {
      res.status(404).json({ error });
    });
};
