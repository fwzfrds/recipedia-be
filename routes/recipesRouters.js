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
  getSavedRecipe,
  getRec
} = require('../controllers/recipesController')
// const { protect, isUser } = require('../middlewares/authMiddleware')
const { protectCookie, isUser: isUserCookie } = require('../middlewares/authCookie')

// const { protect, isUser, isTokenValid } = require('../middlewares/authMiddleware')
const uploadAssets = require('../middlewares/uploadAssets')
const uploadCloudinaryAssets = require('../middlewares/uploadCloudinaryAssets')

//  ----> /recipes.....
router
  .get('/', getAllRecipe)
  .get('/user-recipe', protectCookie, isUserCookie, getRecByUserID)
  .get('/:id', protectCookie, isUserCookie, getRec)
  .get('/liked', protectCookie, isUserCookie, getLikedRecipe)
  .get('/saved', protectCookie, isUserCookie, getSavedRecipe)
  .get('/detail/:id', getRecipeDetail)
  .post('/add', protectCookie, isUserCookie, uploadCloudinaryAssets, insertRecipe)
  .post('/liked', protectCookie, isUserCookie, insertLikedRecipe)
  .post('/saved', protectCookie, isUserCookie, insertSavedRecipe)
  .put('/edit/:id', protectCookie, isUserCookie, uploadAssets, updateRecipe)
  .delete('/:id', protectCookie, isUserCookie, deleteRecipe)

module.exports = router
