require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose')
const mongoURI = process.env.MONGO_URI;
const app = express();

mongoose.connect(mongoURI,
    { useNewUrlParser: true,
      useUnifiedTopology: true })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'))


app.use((req, res) => {
    res.json({message: 'Hello World !!'})
});

module.exports = app;


