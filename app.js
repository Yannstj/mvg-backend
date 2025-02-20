require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const mongoURI = process.env.MONGO_URI;
const app = express();

const userRoutes = require('./routes/user');
const bookRoutes = require('./routes/book');

app.use(express.json()); // important otherwise we cannot access req.body json

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, PATCH, OPTIONS'
  );
  next();
});

mongoose
  .connect(mongoURI /*, { useNewUrlParser: true, useUnifiedTopology: true }*/)
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch((err) => {
    console.log('Connexion à MongoDB échouée !', err);
  });

app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/auth', userRoutes);
app.use('/api/books', bookRoutes);

module.exports = app;
