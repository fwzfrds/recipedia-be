const express = require('express')
const router = express.Router()
const {
  insertRecipe
} = require('../controllers/recipesController')
const { protect, isUser } = require('../middlewares/authMiddleware')
// const { protect, isUser, isTokenValid } = require('../middlewares/authMiddleware')
const uploadAssets = require('../middlewares/uploadAssets')

//  ----> /users.....
router
//   .get('/', getUsers)
  // .get('/active/:token', isTokenValid, userActivate)
//   .get('/profile', protect, isUser, getProfileDetail)
  .post('/add', protect, isUser, uploadAssets, insertRecipe)
//   .post('/add', protect, uploadPhoto.single('photo'), uploadVideo.single('video'), insertRecipe)
//   .post('/login', loginUsers)
  // .post('/refresh-token', refreshToken)
//   .put('/edit', protect, isUser, uploadPhoto.single('photo'), updateUsers)
  // .delete('/:emailid', deleteUsers)

module.exports = router
