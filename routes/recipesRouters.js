const express = require('express')
const router = express.Router()
const {
  insertRecipe,
  getRecipeDetail,
  getAllRecipe,
  updateRecipe,
  deleteRecipe,
  insertLikedRecipe,
  getLikedRecipe
} = require('../controllers/recipesController')
const { protect, isUser } = require('../middlewares/authMiddleware')
// const { protect, isUser, isTokenValid } = require('../middlewares/authMiddleware')
const uploadAssets = require('../middlewares/uploadAssets')

//  ----> /users.....
router
  .get('/', getAllRecipe)
  .get('/liked', protect, isUser, getLikedRecipe)
  // .get('/active/:token', isTokenValid, userActivate)
  .get('/detail/:id', getRecipeDetail)
  .post('/add', protect, isUser, uploadAssets, insertRecipe)
  .post('/liked', protect, isUser, insertLikedRecipe)
//   .post('/add', protect, uploadPhoto.single('photo'), uploadVideo.single('video'), insertRecipe)
//   .post('/login', loginUsers)
  // .post('/refresh-token', refreshToken)
  .put('/edit/:id', protect, isUser, uploadAssets, updateRecipe)
  .delete('/:id', protect, isUser, deleteRecipe)

module.exports = router
