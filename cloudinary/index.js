const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'Memepage',
    allowed_formats: ['jpeg', 'jpg', 'png'],
  },
});

const limits = {
  fileSize: 3145728,
};

module.exports = {
  cloudinary,
  storage,
  limits,
};
