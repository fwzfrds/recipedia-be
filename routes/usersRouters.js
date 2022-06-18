const express = require('express')
const router = express.Router()
const {
  getUsers,
  insertUsers,
  updateUsers,
  // deleteUsers,
  getProfileDetail,
  loginUsers
  // userActivate,
  // refreshToken
} = require('../controllers/usersController')
const { protect, isUser } = require('../middlewares/authMiddleware')
// const { protect, isUser, isTokenValid } = require('../middlewares/authMiddleware')
const uploadPhoto = require('../middlewares/uploadPhoto')

//  ----> /users.....
router
  .get('/', getUsers)
  // .get('/active/:token', isTokenValid, userActivate)
  .get('/profile', protect, isUser, getProfileDetail)
  .post('/registration', uploadPhoto.single('photo'), insertUsers)
  .post('/login', loginUsers)
  // .post('/refresh-token', refreshToken)
  .put('/edit', protect, isUser, uploadPhoto.single('photo'), updateUsers)
  // .delete('/:emailid', deleteUsers)

module.exports = router
