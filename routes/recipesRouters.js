const express = require('express')
const router = express.Router()
const {
  insertRecipe,
  getRecipeDetail,
  getAllRecipe,
  getRecByUserID,
  updateRecipe,
  deleteRecipe,
  insertLikedRecipe,
  insertSavedRecipe,
  getLikedRecipe,
  getSavedRecipe
} = require('../controllers/recipesController')
const { protect, isUser } = require('../middlewares/authMiddleware')
// const { protect, isUser, isTokenValid } = require('../middlewares/authMiddleware')
const uploadAssets = require('../middlewares/uploadAssets')
const uploadCloudinaryAssets = require('../middlewares/uploadCloudinaryAssets')

//  ----> /recipes.....
router
  .get('/', getAllRecipe)
  .get('/user-recipe', protect, isUser, getRecByUserID)
  .get('/liked', protect, isUser, getLikedRecipe)
  .get('/saved', protect, isUser, getSavedRecipe)
  // .get('/saved', protect, isUser, getLikedRecipe)
  // .get('/active/:token', isTokenValid, userActivate)
  .get('/detail/:id', getRecipeDetail)
  // .post('/add', protect, isUser, uploadAssets, insertRecipe)
  .post('/add', protect, isUser, uploadCloudinaryAssets, insertRecipe)
  .post('/liked', protect, isUser, insertLikedRecipe)
  .post('/saved', protect, isUser, insertSavedRecipe)
//   .post('/add', protect, uploadPhoto.single('photo'), uploadVideo.single('video'), insertRecipe)
//   .post('/login', loginUsers)
  // .post('/refresh-token', refreshToken)
  .put('/edit/:id', protect, isUser, uploadAssets, updateRecipe)
  .delete('/:id', protect, isUser, deleteRecipe)

module.exports = router
