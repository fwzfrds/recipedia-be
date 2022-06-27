const express = require('express')
const router = express.Router()
const {
  getUsers,
  insertUsers,
  updateUsers,
  // deleteUsers,
  getProfileDetail,
  loginUsers,
  userActivate
  // refreshToken
} = require('../controllers/usersController')
// const { protect, isUser, isTokenValid } = require('../middlewares/authMiddleware')
const { protectCookie, isUser, isTokenValid } = require('../middlewares/authCookie')
const uploadPhoto = require('../middlewares/uploadPhoto')
const uploadCloud = require('../middlewares/uploadCloudinaryImg')

//  ----> /users.....
router
  .get('/', getUsers)
  .get('/active/:token', isTokenValid, userActivate)
  // .get('/profile', protect, isUser, getProfileDetail)
  .get('/profile', protectCookie, isUser, getProfileDetail)
  .post('/registration', uploadPhoto.single('photo'), insertUsers)
  .post('/login', loginUsers)
  // .post('/refresh-token', refreshToken)
  // .put('/edit', protect, isUser, uploadPhoto.single('photo'), updateUsers)
  // .put('/edit', protect, isUser, uploadCloud.single('photo'), updateUsers)
  .put('/edit', protectCookie, isUser, uploadCloud.single('photo'), updateUsers)
  // .delete('/:emailid', deleteUsers)

module.exports = router
