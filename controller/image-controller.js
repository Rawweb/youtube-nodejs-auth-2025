const Image = require('../models/image-model');
const { uploadToCloudinary } = require('../helpers/cloudinary-helper');
const fs = require('fs');
const cloudinary = require('../config/cloudinary');

const uploadImageController = async (req, res) => {
  try {
    //INFO: Check if file is missing in req object
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'File is required. Please upload an image!',
      });
    }

    //INFO: Upload to cloudinary
    const { url, publicId } = await uploadToCloudinary(req.file.path);

    //INFO: Save the IMAGE_URL and PUBLIDID along with the uploaded user id in the DB
    const newlyUploadedImage = new Image({
      url,
      publicId,
      uploadedBy: req.userInfo.userId,
    });

    await newlyUploadedImage.save();

    //INFO: Delete the uploaded file from local storage
    // fs.unlinkSync(req.file.path);

    res.status(201).json({
      success: true,
      message: 'Image uploaded successfully',
      image: newlyUploadedImage,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: 'Something went wrong please try again!',
    });
  }
};

//INFO: Fetch all images uploaded by a user
const fetchImagesController = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 2;
    const skip = (page - 1) * limit;

    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : 1;
    const totalImages = await Image.countDocuments();
    const totalPages = Math.ceil(totalImages / limit);

    const sortObj = {};
    sortObj[sortBy] = sortOrder;
    const images = await Image.find().sort(sortObj).skip(skip).limit(limit);

    if (images) {
      res.status(200).json({
        success: true,
        currentPage: page,
        totalPage: totalPages,
        totalImages: totalImages,
        message: 'Images fetched successfully',
        data: images,
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: 'Something went wrong please try again!',
    });
  }
};

//INFO: Delete an image uploaded by a user
const deleteImageController = async (req, res) => {
  try {
    const getCurrentImage = req.params.id;
    const userId = req.userInfo.userId;

    const image = await Image.findById(getCurrentImage);

    if (!image) {
      return res.status(404).json({
        sucess: false,
        message: 'Image not found',
      });
    }

    //INFO: Check if the image is uploaded by the user
    if (image.uploadedBy.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this image',
      });
    }

    //INFO: Delete the image from cloudinary
    await cloudinary.uploader.destroy(image.publicId);

    //INFO: Delete the image from MongoDB
    await Image.findByIdAndDelete(getCurrentImage);

    res.status(200).json({
      success: true,
      message: 'Image deleted successfully',
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: 'Something went wrong please try again!',
    });
  }
};

module.exports = {
  uploadImageController,
  fetchImagesController,
  deleteImageController,
};
