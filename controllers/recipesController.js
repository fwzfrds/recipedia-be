const recipesModel = require('../models/recipesModel')
const fs = require('fs')
const createError = require('http-errors')
const { v4: uuidv4 } = require('uuid')
const { response, notFoundRes } = require('../helper/common')
const cloudinary = require('../config/cloudinaryConfig')

const errorServer = new createError.InternalServerError()

const getAllRecipe = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1
    let limit = parseInt(req.query.limit) || 3
    const offset = (page - 1) * limit

    const sortBy = req.query.sortby || 'created_at'
    const sortOrder = req.query.sortorder || ''
    const search = req.query.search || ''

    const result = await recipesModel.getAllRecipe({ limit, offset, sortBy, sortOrder, search })
    const resultCount = await recipesModel.getAllRecipe({ sortBy, sortOrder, search })

    const { rows: [count] } = await recipesModel.countRecipes()
    console.log(count)
    console.log((result.rows).length)
    console.log((resultCount.rows).length)
    const totalData = search === '' ? parseInt(count.total) : (resultCount.rows).length
    const dataInThisPage = (result.rows).length

    if (totalData < limit) {
      limit = totalData
    }

    if ((result.rows).length === 0) {
      notFoundRes(res, 404, 'Data not found')
    }

    const totalPage = Math.ceil(totalData / limit)
    const pagination = {
      currentPage: page,
      dataInThisPage,
      dataPerPage: limit,
      totalData,
      totalPage
    }

    response(res, result.rows, 200, 'Get data success', pagination)
  } catch (error) {
    console.log(error)
    next(errorServer)
  }
}

const getRecipeDetail = async (req, res) => {
  try {
    const recipeID = req.params.id
    console.log(recipeID)
    const result = await recipesModel.recipeDetail(recipeID)
    // console.log(result.rows)

    if ((result.rows).length === 0) {
      return notFoundRes(res, 404, 'Data not found')
    }

    response(res, result.rows[0], 200, 'Get data success')
  } catch (error) {
    console.log(error)
  }
}

const insertRecipe = async (req, res, next) => {
  const id = req.decoded.id
  const { title, ingredients } = req.body
  let photo
  let video
  const idUser = id

  console.log(req.files)
  // let videoCloud

  //   upload single image to local
  // if (req.files.photo) {
  //   photo = `http://${req.get('host')}/img/recipe/photo/${req.files.photo[0].filename}`
  // }

  //   upload single video local
  // if (req.files.video) {
  //   video = `http://${req.get('host')}/video/recipe/video/${req.files.video[0].filename}`
  // }

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
    // Upload Photo single ke Cloudinary
    if (req.files.photo) {
      photo = req.files.photo[0].path

      const url = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload(photo, { folder: 'recipedia/photos' }, function (error, result) {
          if (result) {
            resolve(result.url)
          } else if (error) {
            reject(error)
          }
        })
      })

      data.photo = url
    } else {
      console.log('add recipe without edit photo')
    }

    // Upload Photo single ke Cloudinary
    if (req.files.video) {
      video = req.files.video[0].path

      const url = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload(video, { folder: 'recipedia/videos', resource_type: 'video' }, function (error, result) {
          if (result) {
            resolve(result.url)
          } else if (error) {
            reject(error)
          }
        })
      })

      data.video = url
    } else {
      console.log('add recipe without edit video')
    }
    // await recipesModel.insertRecipeData(recipeData)
    // await recipesModel.insertRecipeAssets(recipeAssets)

    response(res, data, 201, 'Add new recipe success')
  } catch (error) {
    console.log(error)
    // Code below is for handling uploading error to local
    // const errorPhoto = (photo).replace('http://localhost:4000/img/recipe/photo', '')
    // const errorVideo = (video).replace('http://localhost:4000/video/recipe/video', '')
    // if (error) {
    //   fs.unlink(`./upload/recipe/photo/${errorPhoto}`, function (err) {
    //     if (err) {
    //       console.log('error while deleting the file ' + err)
    //     }
    //   })
    //   fs.unlink(`./upload/recipe/video/${errorVideo}`, function (err) {
    //     if (err) {
    //       console.log('error while deleting the file ' + err)
    //     }
    //   })
    // }
    next(errorServer)
  }
}

const insertLikedRecipe = async (req, res, next) => {
  const id = req.decoded.id
  const { idRecipe } = req.body
  const idUser = id

  const { rows: [count] } = await recipesModel.checkLikedExisting(idRecipe, `'${idUser}'`)
  if (count.total >= 1) {
    return notFoundRes(res, 403, 'The Recipe is already in your list')
  }

  const data = {
    idRecipe,
    idUser
  }

  try {
    await recipesModel.insertLikedRecipe(data)
    response(res, data, 201, 'The recipe has been added to liked list')
  } catch (error) {
    console.log(error)
    next(errorServer)
  }
}

const insertSavedRecipe = async (req, res, next) => {
  const id = req.decoded.id
  const { idRecipe } = req.body
  const idUser = id

  const { rows: [count] } = await recipesModel.checkSavedExisting(idRecipe, `'${idUser}'`)
  if (count.total >= 1) {
    return notFoundRes(res, 403, 'The Recipe is already in your list')
  }

  const data = {
    idRecipe,
    idUser
  }

  try {
    await recipesModel.insertSavedRecipe(data)
    response(res, data, 201, 'The recipe has been added to saved list')
  } catch (error) {
    console.log(error)
    next(errorServer)
  }
}

const getLikedRecipe = async (req, res, next) => {
  const idUser = (`'${req.decoded.id}'`)
  console.log(idUser)

  try {
    const page = parseInt(req.query.page) || 1
    let limit = parseInt(req.query.limit) || 4
    const offset = (page - 1) * limit

    const sortBy = req.query.sortby || 'random ()'
    const sortOrder = req.query.sortorder || ''
    const search = req.query.search || ''

    const result = await recipesModel.getLikedRecipe({ limit, offset, sortBy, sortOrder, search, idUser })

    const { rows: [count] } = await recipesModel.countLikedRecipes(idUser)
    const totalData = search === '' ? parseInt(count.total) : (result.rows).length

    if (totalData < limit) {
      limit = totalData
    }

    if ((result.rows).length === 0) {
      notFoundRes(res, 404, 'Data not found')
    }

    const totalPage = Math.ceil(totalData / limit)
    const pagination = {
      currentPage: page,
      dataPerPage: limit,
      totalData,
      totalPage
    }

    response(res, result.rows, 200, 'Get data success', pagination)
  } catch (error) {
    console.log(error)
    next(errorServer)
  }
}

const getSavedRecipe = async (req, res, next) => {
  const idUser = (`'${req.decoded.id}'`)
  console.log(idUser)

  try {
    const page = parseInt(req.query.page) || 1
    let limit = parseInt(req.query.limit) || 4
    const offset = (page - 1) * limit

    const sortBy = req.query.sortby || 'random ()'
    const sortOrder = req.query.sortorder || ''
    const search = req.query.search || ''

    const result = await recipesModel.getSavedRecipe({ limit, offset, sortBy, sortOrder, search, idUser })

    const { rows: [count] } = await recipesModel.countSavedRecipes(idUser)
    const totalData = search === '' ? parseInt(count.total) : (result.rows).length

    if (totalData < limit) {
      limit = totalData
    }

    if ((result.rows).length === 0) {
      notFoundRes(res, 404, 'Data not found')
    }

    const totalPage = Math.ceil(totalData / limit)
    const pagination = {
      currentPage: page,
      dataPerPage: limit,
      totalData,
      totalPage
    }

    response(res, result.rows, 200, 'Get data success', pagination)
  } catch (error) {
    console.log(error)
    next(errorServer)
  }
}

const updateRecipe = async (req, res, next) => {
  const userID = req.decoded.id
  console.log(userID)
  const recipeID = req.params.id
  const { title, ingredients } = req.body
  const updatedAt = new Date()
  let photo
  let video
  console.log(req.files)

  // To unlink if recipe doesn't exist in database
  const { rows: [recipeDetail] } = await recipesModel.recipeDetail(recipeID)
  if (!recipeDetail) {
    return notFoundRes(res, 404, 'Data not found, you cannot edit data which is not exist')
  }
  // if (!recipeDetail) {
  //   notFoundRes(res, 404, 'Data not found, you cannot edit data which is not exist')
  //   if (req.files.photo) {
  //     fs.unlink(`./upload/recipe/photo/${req.files.photo[0].filename}`, function (err) {
  //       if (err) {
  //         console.log('error while deleting the file ' + err)
  //       }
  //     })
  //   }

  //   if (req.files.video) {
  //     fs.unlink(`./upload/recipe/video/${req.files.video[0].filename}`, function (err) {
  //       if (err) {
  //         console.log('error while deleting the file ' + err)
  //       }
  //     })
  //   }
  //   return
  // }

  //   upload single image to local
  // if (req.files.photo) {
  //   photo = `http://${req.get('host')}/img/recipe/photo/${req.files.photo[0].filename}`
  //   console.log('Deleting Previous Photo')
  //   const previousPhoto = (recipeDetail.photo).replace('http://localhost:4000/img/recipe/photo', '')
  //   fs.unlink(`./upload/recipe/photo/${previousPhoto}`, function (err) {
  //     if (err) {
  //       console.log('error while deleting the file ' + err)
  //     }
  //   })
  // }

  //   upload single video to local
  // if (req.files.video) {
  //   video = `http://${req.get('host')}/video/recipe/video/${req.files.video[0].filename}`
  //   console.log('Deleting Previous Video')
  //   const previousVideo = (recipeDetail.photo).replace('http://localhost:4000/video/recipe/video', '')
  //   fs.unlink(`./upload/recipe/video/${previousVideo}`, function (err) {
  //     if (err) {
  //       console.log('error while deleting the file ' + err)
  //     }
  //   })
  // }

  const recipeUpdatedData = {
    title,
    ingredients,
    updatedAt
  }

  const recipeUpdateAssets = {
    photo,
    video,
    updatedAt
  }

  if (recipeUpdatedData.title === '') {
    // updatedData.title = undefined
    delete recipeUpdatedData.title
  }

  if (recipeUpdatedData.ingredients === '') {
    // recipeUpdatedData.ingredients = undefined
    delete recipeUpdatedData.ingredients
  }

  try {
    // Upload Photo single ke Cloudinary
    if (req.files.photo) {
      photo = req.files.photo[0].path

      const url = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload(photo, { folder: 'recipedia/photos' }, function (error, result) {
          if (result) {
            resolve(result.url)
          } else if (error) {
            reject(error)
          }
        })
      })

      recipeUpdateAssets.photo = url
    } else {
      console.log('add recipe without edit photo')
    }

    // Upload Photo single ke Cloudinary
    if (req.files.video) {
      video = req.files.video[0].path

      const url = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload(video, { folder: 'recipedia/videos', resource_type: 'video' }, function (error, result) {
          if (result) {
            resolve(result.url)
          } else if (error) {
            reject(error)
          }
        })
      })

      recipeUpdateAssets.video = url
    } else {
      console.log('add recipe without edit video')
    }

    if (recipeUpdatedData.title || recipeUpdatedData.ingredients) {
      await recipesModel.updateRecipeData(recipeUpdatedData, recipeID, userID)
    }

    if (recipeUpdateAssets.photo || recipeUpdateAssets.video) {
      await recipesModel.updateRecipeAssets(recipeUpdateAssets, recipeID)
    }

    const updatedData = {
      ...recipeUpdatedData,
      ...recipeUpdateAssets
    }

    console.log(updatedData)

    response(res, updatedData, 201, 'Add new recipe success')
  } catch (error) {
    console.log(error)
    // if (error) {
    //   if (photo) {
    //     const errorPhoto = (photo).replace('http://localhost:4000/img/recipe/photo', '')
    //     fs.unlink(`./upload/recipe/photo/${errorPhoto}`, function (err) {
    //       if (err) {
    //         console.log('error while deleting the file ' + err)
    //       }
    //     })
    //   } else if (video) {
    //     const errorVideo = (video).replace('http://localhost:4000/video/recipe/video', '')
    //     fs.unlink(`./upload/recipe/video/${errorVideo}`, function (err) {
    //       if (err) {
    //         console.log('error while deleting the file ' + err)
    //       }
    //     })
    //   }
    // }
    next(errorServer)
  }
}

const deleteRecipe = async (req, res, next) => {
  const recipeID = req.params.id

  const { rows: [recipeDetail] } = await recipesModel.recipeDetail(recipeID)

  if (recipeDetail) {
    if (recipeDetail.photo) {
      const photo = (recipeDetail.photo).replace('http://localhost:4000/img/recipe/photo/', '')
      fs.unlink(`./upload/recipe/photo/${photo}`, function (err) {
        if (err) {
          console.log('error while deleting the file ' + err)
        }
      })
    }

    if (recipeDetail.video) {
      const video = (recipeDetail.video).replace('http://localhost:4000/video/recipe/video/', '')
      fs.unlink(`./upload/recipe/video/${video}`, function (err) {
        if (err) {
          console.log('error while deleting the file ' + err)
        }
      })
    }
  } else {
    return notFoundRes(res, 404, 'Data not found, you cannot edit data which is not exist')
  }

  try {
    recipesModel.deleteRecipeData(recipeID)
    recipesModel.deleteRecipeAssets(recipeID)

    response(res, recipeDetail.title, 200, 'Delete recipe success')
  } catch (error) {
    console.log(error)
    next(errorServer)
  }
}

module.exports = {
  getAllRecipe,
  insertRecipe,
  getRecipeDetail,
  getLikedRecipe,
  getSavedRecipe,
  updateRecipe,
  insertLikedRecipe,
  insertSavedRecipe,
  deleteRecipe
}
