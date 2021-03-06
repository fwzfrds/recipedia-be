const express = require('express')
const router = express.Router()
const {
  getUsers,
  insertUsers,
  updateUsers,
  // deleteUsers,
  getProfileDetail,
  loginUsers,
  userActivate,
  userLogout
  // refreshToken
} = require('../controllers/usersController')
// const { protect, isUser, isTokenValid } = require('../middlewares/authMiddleware')
const { protectCookie, isUser: isUserCookie, isTokenValid } = require('../middlewares/authCookie')
const uploadPhoto = require('../middlewares/uploadPhoto')
const uploadCloud = require('../middlewares/uploadCloudinaryImg')

//  ----> /users.....
router
  .get('/', getUsers)
  .get('/active/:token', isTokenValid, userActivate)
  .get('/profile', protectCookie, isUserCookie, getProfileDetail)
  .post('/registration', uploadPhoto.single('photo'), insertUsers)
  .post('/login', loginUsers)
  .get('/logout', protectCookie, isUserCookie, userLogout)
  // .post('/refresh-token', refreshToken)
  .put('/edit', protectCookie, isUserCookie, uploadCloud.single('photo'), updateUsers)
  // .delete('/:emailid', deleteUsers)

module.exports = router
