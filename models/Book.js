const mongoose = require('mongoose');

const bookSchema = mongoose.Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  author: { type: String, required: true },
  imageUrl: { type: String },
  year: { type: Number, required: true },
  genre: { type: String, required: true },
  ratings: [{ userId: String, grade: Number }],
  averageRating: { type: Number },
});

module.exports = mongoose.model('Book', bookSchema);
