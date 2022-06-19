const recipesModel = require('../models/recipesModel')
const fs = require('fs')
// const adminModel = require('../models/adminModel')
const createError = require('http-errors')
const { v4: uuidv4 } = require('uuid')
// const bcrypt = require('bcryptjs')
// const jwt = require('jsonwebtoken')
// const { response, notFoundRes } = require('../helper/common')
const { response } = require('../helper/common')
// const { generateToken, generateRefreshToken } = require('../helper/authHelper')

const errorServer = new createError.InternalServerError()

const insertRecipe = async (req, res, next) => {
  console.log(req.files)
  console.log(req.files.photo[0].filename)
  console.log(req.files.photo[0].filename)
  console.log(req.files.video)
  console.log(req.files.video)
  const decode = req.decoded
  console.log(decode)
  const id = req.decoded.id
  const { title, ingredients } = req.body
  let photo
  let video
  const idUser = id
  console.log(idUser)

  //   upload single image
  if (req.files.photo) {
    photo = `http://${req.get('host')}/img/recipe/photo/${req.files.photo[0].filename}`
  }

  //   upload single video
  if (req.files.video) {
    video = `http://${req.get('host')}/video/recipe/video/${req.files.video[0].filename}`
  }

  const recipeData = {
    id: uuidv4(),
    idUser,
    title,
    ingredients
  }

  const recipeAssets = {
    idRecipe: recipeData.id,
    photo,
    video
  }

  const data = {
    ...recipeData,
    ...recipeAssets
  }

  try {
    await recipesModel.insertRecipeData(recipeData)
    await recipesModel.insertRecipeAssets(recipeAssets)

    response(res, data, 201, 'Add new recipe success')
  } catch (error) {
    console.log(error)
    const errorPhoto = (photo).replace('http://localhost:4000/img/recipe/photo', '')
    const errorVideo = (video).replace('http://localhost:4000/video/recipe/video', '')
    if (error) {
      fs.unlink(`./upload/recipe/photo/${errorPhoto}`, function (err) {
        if (err) {
          console.log('error while deleting the file ' + err)
        }
      })
      fs.unlink(`./upload/recipe/video/${errorVideo}`, function (err) {
        if (err) {
          console.log('error while deleting the file ' + err)
        }
      })
    }
    next(errorServer)
  }
}

module.exports = {
  insertRecipe
}
