const mongoose = require('mongoose');

const bookSchema = mongoose.Schema({
  userId: { type: String, require: true },
  title: { type: String, require: true },
  author: { type: String, require: true },
  imageUrl: { type: String, require: true },
  year: { type: Number, require: true },
  genre: { type: String, require: true },
  ratings: [{ userId: String, grade: Number, require: true }],
  averageRating: { type: Number, require: true },
});

module.exports('Book', bookSchema);
