const sharp = require('sharp');
const path = require('path');
//const fs = require('fs');

// Middleware pour traiter l'image avec Sharp après l'upload
const processImage = async (req, res, next) => {
  if (req.file) {
    try {
      const filePath = path.join('images', req.file.filename); // Chemin du fichier enregistré

      // Redimensionner et convertir l'image en WebP
      await sharp(req.file.path)
        .resize(400) // Redimensionner à 400px de largeur (garde le ratio)
        .toFormat('webp') // Convertir au format WebP
        .toFile(filePath); // Sauvegarder l'image traitée

      console.log('Image traitée et sauvegardée:', filePath);
      next(); // Passe à l'étape suivante (par exemple, création de livre)
    } catch (error) {
      console.error("Erreur lors du traitement de l'image:", error);
      return res
        .status(500)
        .json({ error: "Erreur lors du traitement de l'image" });
    }
  } else {
    return res.status(400).json({ error: 'Aucune image reçue' });
  }
};

module.exports = processImage;
