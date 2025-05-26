const express = require('express');
const authMiddleware = require('../middlewares/auth-middleware');
const adminMiddleware = require('../middlewares/admin-middleware');
const uploadMiddleware = require('../middlewares/upload-middleware');
const {
  uploadImageController,
  fetchImagesController,
  deleteImageController,
} = require('../controller/image-controller');

const router = express.Router();

//INFO: Upload the image
router.post(
  '/upload',
  authMiddleware,
  adminMiddleware,
  uploadMiddleware.single('image'),
  uploadImageController
);

//INFO: Get all the images
router.get('/get', authMiddleware, fetchImagesController);

//6804e17fb06f02a7057c609b

//INFO: Delete the image
router.delete('/:id', authMiddleware, adminMiddleware, deleteImageController);

module.exports = router;
