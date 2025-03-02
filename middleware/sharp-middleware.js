const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const IMAGE_FOLDER = 'images';

if (!fs.existsSync(IMAGE_FOLDER)) {
  fs.mkdirSync(IMAGE_FOLDER);
}

const processImage = async (req, res, next) => {
  if (!req.file) {
    return next();
  }

  try {
    const fileName = `image_${Date.now()}.webp`;
    const filePath = path.join(IMAGE_FOLDER, fileName);

    await sharp(req.file.buffer).resize(400).toFormat('webp').toFile(filePath);

    // Ajouter le chemin du fichier traité à req.file pour l'utiliser plus tard
    req.file.filename = fileName;
    req.file.path = filePath;
    req.file.mimetype = 'image/webp';

    // console.log('Image traitée et sauvegardée en WebP:', filePath);
    next();
  } catch (error) {
    // console.error("Erreur lors du traitement de l'image:", error);
    return res.status(500).json({ error });
  }
};

module.exports = processImage;
