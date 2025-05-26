const multer = require('multer');
const path = require('path');

//INFO Set our multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(
      null,

      file.fieldname + '_' + Date.now() + path.extname(file.originalname)
    );
  },
});

//INFO: File filter function
const checkFileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload only images.'));
  }
};

//INFO: Multer middleware
module.exports = multer({
  storage: storage,
  fileFilter: checkFileFilter,
  limits: {
    fileSize: 1024 * 1024 * 5, // 5MB
  },
});
