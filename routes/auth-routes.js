const express = require('express')
const {registerUser, loginUser, changePassword} = require('../controller/auth-controller')
const authMiddlewares = require('../middlewares/auth-middleware')


const router = express.Router()

//INFO All routes related to authentication & authorization
router.post('/register', registerUser)
router.post('/login', loginUser)
router.post('/change-password', authMiddlewares, changePassword)

module.exports = router