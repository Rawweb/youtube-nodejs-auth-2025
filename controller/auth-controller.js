const User = require('../models/user-model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//INFO register controller
const registerUser = async (req, res) => {
  try {
    //INFO extract user info from our request body
    const { username, email, password, role } = req.body;

    //INFO Check if the user is existing in our DB
    const checkExistingUser = await User.findOne({
      $or: [{ username }, { email }],
    });
    if (checkExistingUser)
      return res.status(400).json({
        status: false,
        message: 'User is already existing either with same username or email',
      });

    //INFO Hash user password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //INFO create a new user and save in yourDB
    const newlyCreatedUser = new User({
      username,
      email,
      password: hashedPassword,
      role: role || 'user',
    });

    await newlyCreatedUser.save();

    if (newlyCreatedUser) {
      res.status(201).json({
        status: true,
        message: 'User registered succefully!',
      });
    } else {
      res.status(400).json({
        status: false,
        message: 'Unable to register user! Please try again',
      });
    }
  } catch (err) {
    res.status(500).json({
      status: false,
      message: 'Some error occured! Please Try again',
      error: err.message,
    });
  }
};

//INFO login controller
const loginUser = async (req, res) => {
  try {
    //INFO extract username and password from req.body
    const { username, password } = req.body;

    //INFO CHeck if the current user exists in thr DB
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: `Invaid username or passowrd`,
      });
    }

    //INFO check if the password is correct or not
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(400).json({
        success: false,
        message: 'Invalid username or password',
      });
    }

    //INFO create user token
    const accessToken = jwt.sign(
      {
        userId: user._id,
        username: user.username,
        role: user.role,
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: '50m',
      }
    );

    res.status(200).json({
      success: true,
      message: 'Logged in succesfully',
      accessToken,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: 'Some error occured! Please Try again',
    });
  }
};

//INFO: Change password controller
const changePassword = async (req, res) => {
  try {
    const userId = req.userInfo.userId;
    const { oldPassword, newPassword } = req.body;

    //INFO: Check if the user exists in the DB
    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({
        status: false,
        message: `User doesn't exist`,
      });
    }

    //INFO: Check if the old password is correct or not
    const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isPasswordMatch) {
      return res.status(400).json({
        status: false,
        message: 'Invalid old password',
      });
    }

    //INFO: Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    //INFO: Update the password in the DB
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({
      status: true,
      message: 'Password changed successfully',
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: false,
      message: 'Some error occured! Please Try again',
    });
  }
};

module.exports = { registerUser, loginUser, changePassword };
