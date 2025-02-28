const multer = require('multer');

// Définition des types MIME autorisés
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png',
};
//memoryStorage pour traiter l'image en mémoire
const storage = multer.memoryStorage();

const fileFilter = (req, file, callback) => {
  if (!MIME_TYPES[file.mimetype]) {
    return callback(new Error('Type de fichier non autorisé'), false);
  }
  callback(null, true);
};

module.exports = multer({ storage, fileFilter }).single('image');
