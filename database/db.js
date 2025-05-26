const mongoose = require('mongoose');

connectToDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB Successfully 😍💕');
  } catch (err) {
    console.log('Error 💥 connecting to MongoDB', err);
    process.exit(1);
  }
};

module.exports = connectToDB;
